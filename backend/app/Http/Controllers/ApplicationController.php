<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Job;
use App\Models\CvData;
use App\Exceptions\ApplicationLimitReachedException;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        file_put_contents(base_path('test_log.txt'), "Prueba de log alternativo\n", FILE_APPEND);
        Log::info('Probando log simple desde ApplicationController@store');
        try {
            // Verificar que el usuario esté autenticado
            if (!Auth::check()) {
                Log::error('Usuario no autenticado al intentar crear aplicación');
                return response()->json(['message' => 'No estás autenticado. Por favor, inicia sesión.'], 401);
            }

            $validator = Validator::make($request->all(), [
                'job_id' => 'required|exists:jobs,id',
                'cover_letter' => 'required|string',
                'experience' => 'required|string',
                'cv' => 'nullable|file|mimes:pdf,doc,docx,odt,txt|max:4096',
                'cv_option' => 'nullable|string|in:new,profile,web',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $userId = Auth::id();
            /** @var \App\Models\User|null $user */
            $user = Auth::user();

            $cvPath = '';
            $cvOption = $request->input('cv_option', 'new');

            // Verificar que el usuario tenga al menos un CV (cargado o web)
            $hasProfileCv = $user->cv && !empty($user->cv);
            $hasWebCv = CvData::where('user_id', $userId)->exists();

            if (!$hasProfileCv && !$hasWebCv) {
                return response()->json([
                    'message' => 'Debes tener al menos un CV configurado (CV cargado o CV web) para enviar una aplicación.'
                ], 400);
            }

            if ($cvOption === 'new' && $request->hasFile('cv')) {
                $cvPath = $request->file('cv')->store('cvs', 'public');
            } elseif ($cvOption === 'profile') {
                if (!$hasProfileCv) {
                    return response()->json([
                        'message' => 'No tienes un CV cargado. Por favor, selecciona tu CV web o sube un CV en tu perfil.'
                    ], 400);
                }
                // Copiar el CV existente del perfil a la carpeta de aplicaciones para mantener integridad
                $cvPath = $user->cv;
            } elseif ($cvOption === 'web') {
                if (!$hasWebCv) {
                    return response()->json([
                        'message' => 'No tienes un CV web configurado. Por favor, crea tu CV web o sube un CV en tu perfil.'
                    ], 400);
                }
                // Marcar que usa el CV Web (podemos guardar una referencia o simplemente el texto 'WEB_CV')
                $cvPath = 'WEB_CV';
            } else {
                // Si no se seleccionó ninguna opción válida y no se subió un archivo nuevo
                if (!$hasProfileCv && !$hasWebCv) {
                    return response()->json([
                        'message' => 'Debes seleccionar un CV o subir uno nuevo para enviar la aplicación.'
                    ], 400);
                }
            }

            // Validar que se haya establecido un cvPath
            if (empty($cvPath) && !$request->hasFile('cv')) {
                return response()->json([
                    'message' => 'Debes seleccionar un CV o subir uno nuevo para enviar la aplicación.'
                ], 400);
            }
            
            if (!$userId || !$user) {
                Log::error('Error: userId o user es null', ['userId' => $userId, 'user' => $user]);
                return response()->json(['message' => 'Error de autenticación. Por favor, inicia sesión nuevamente.'], 401);
            }
            // No permitir más de una postulación al mismo trabajo
            $existing = Application::where('user_id', $userId)
                ->where('job_id', $request->job_id)
                ->first();
            if ($existing) {
                return response()->json(['message' => 'Ya has enviado una postulación para este trabajo.'], 400);
            }
            // No permitir más de 2 postulaciones en total (solo para plan gratuito)
            if ($user && $user->role === 'user' && $user->plan === 'free') {
                $recentApplications = Application::where('user_id', $userId)
                    ->where('created_at', '>=', now()->subMonth())
                    ->count();

                if ($recentApplications >= 2) {
                    throw new ApplicationLimitReachedException('Has alcanzado el límite de 2 postulaciones por mes en el plan gratuito. Actualiza a Plan Profesional para postulaciones ilimitadas.');
                }
            }

            $job = Job::findOrFail($request->job_id);
            $company = $job->user; // dueña del trabajo (puede ser null si hay datos inconsistentes)
            if ($company && $company->plan === 'free') {
                $applicationsCount = Application::where('job_id', $job->id)->count();
                if ($applicationsCount >= 5) {
                    return response()->json(['message' => 'Este trabajo ha alcanzado el límite de 5 postulaciones para empresas gratuitas.'], 400);
                }
            }

            // Usar transacción para garantizar integridad de datos
            $application = DB::transaction(function () use ($request, $userId, $user, $cvPath, $job, $company) {
                $application = Application::create([
                    'job_id' => $request->job_id,
                    'user_id' => $userId,
                    'cover_letter' => $request->cover_letter,
                    'resume' => $cvPath,
                    'phone' => $user->phone ?? '',
                    'email' => $user->email ?? '',
                    'status' => 'pending',
                    'experience' => $request->experience,
                ]);

                // Notificar al usuario que postuló
                \App\Models\Notification::createForUser($userId, 'application_sent', 'Has enviado una solicitud para el trabajo: ' . $job->title);
                
                // Notificar a la empresa dueña del trabajo
                if ($company) {
                    \App\Models\Notification::createForUser($company->id, 'application_received', 'Has recibido una nueva postulación para el trabajo: ' . $job->title);
                } else {
                    Log::warning('Job sin empresa asociada al crear postulación', ['job_id' => $job->id]);
                }

                return $application;
            });

            return response()->json($application, 201);
        } catch (\Exception $e) {
            file_put_contents(base_path('test_log.txt'), "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n", FILE_APPEND);
            return response()->json(['message' => 'Error interno al procesar la postulación.'], 500);
        }
    }
    public function userApplications(Request $request)
    {
        $query = Application::where('user_id', Auth::id())
            ->with('job')
            ->orderBy('created_at', 'desc');
        
        // Filtrar por job_id si se proporciona
        if ($request->has('job_id') && $request->job_id) {
            $query->where('job_id', $request->job_id);
        }
        
        $applications = $query->get();

        return response()->json($applications);
    }

    public function jobApplications($jobId)
    {
        $job = Job::findOrFail($jobId);
        
        // Verificar que el usuario autenticado es el dueño del trabajo
        if ($job->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $applications = Application::where('job_id', $jobId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    
    // Permitir a la empresa borrar postulaciones recibidas en sus trabajos
    
    public function destroy($id)
    {
        $application = Application::findOrFail($id);
        $job = $application->job;
        if (!$job) {
            return response()->json(['message' => 'Postulación sin trabajo asociado.'], 409);
        }
        // La empresa dueña del trabajo puede borrar la postulación
        if ($job->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        $application->delete();
        return response()->json(['message' => 'Postulación eliminada correctamente.']);
    }

    // Obtener todas las postulaciones de los trabajos publicados por la empresa

    public function companyApplications()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if (!$user || $user->role !== 'company') {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        $jobs = Job::where('user_id', $user->id)->with('applications.user')->get();
        $applications = [];
        foreach ($jobs as $job) {
            foreach ($job->applications as $application) {
                $applications[] = [
                    'application_id' => $application->id,
                    'job_id' => $job->id,
                    'job_title' => $job->title,
                    'applicant_name' => $application->user->name ?? '',
                    'applicant_email' => $application->user->email ?? '',
                    'cover_letter' => $application->cover_letter,
                    'experience' => $application->experience,
                    'status' => $application->status,
                    'resume' => $application->resume, // Añadido
                    'user_id' => $application->user_id, // Añadido
                    'created_at' => $application->created_at,
                ];
            }
        }
        return response()->json($applications);
    }

    public function updateStatus(Request $request, $id)
    {
        $application = Application::findOrFail($id);
        $job = $application->job;

        // Solo la empresa dueña puede cambiar el estado
        if (!$job || $job->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,accepted,rejected,shortlisted',
        ]);

        $application->status = $request->status;
        $application->save();

        // Si se acepta a alguien, verificar si se han llenado todas las vacantes
        if ($application->status === 'accepted') {
            $acceptedCount = Application::where('job_id', $job->id)
                ->where('status', 'accepted')
                ->count();
            
            if ($acceptedCount >= $job->vacancies) {
                $job->status = 'closed';
                $job->save();
                
                // Notificar a la empresa
                \App\Models\Notification::createForUser($job->user_id, 'job_closed', "Se han cubierto todas las vacantes para '{$job->title}'. La oferta ha sido cerrada automáticamente.");
            }
        }

        // Notificar al usuario
        $msg = "Tu postulación para '{$job->title}' ha cambiado a: " . $application->status;
        if ($application->status === 'accepted') $msg = "¡Enhorabuena! Has sido seleccionado para la vacante '{$job->title}'.";
        if ($application->status === 'rejected') $msg = "Gracias por participar en el proceso de '{$job->title}'. Lamentablemente no hemos avanzado con tu perfil.";

        \App\Models\Notification::createForUser($application->user_id, 'application_status_changed', $msg);

        // Recargar el trabajo con los contadores actualizados
        $job->refresh();
        $job->loadCount('applications');
        $job->loadCount(['applications as accepted_count' => function($q) {
            $q->where('status', 'accepted');
        }]);

        // Formatear el trabajo usando el JobController
        $jobController = new \App\Http\Controllers\JobController();
        $reflection = new \ReflectionClass($jobController);
        $method = $reflection->getMethod('formatJob');
        $method->setAccessible(true);
        $formattedJob = $method->invoke($jobController, $job);

        return response()->json([
            'application' => $application,
            'job' => $formattedJob
        ]);
    }

    public function notifyCvView($id)
    {
        $application = Application::findOrFail($id);
        $job = $application->job;

        if (!$job || $job->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        \App\Models\Notification::createForUser(
            $application->user_id, 
            'cv_read', 
            "La empresa ha leído tu CV para la vacante: " . $job->title
        );

        return response()->json(['message' => 'Notificación enviada']);
    }

    public function downloadApplicationCv($id)
    {
        $application = Application::findOrFail($id);
        $job = $application->job;

        if (!$job || $job->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Notificar que se ha leído
        $this->notifyCvView($id);

        if ($application->resume === 'WEB_CV') {
            $user = $application->user;
            $cvData = \App\Models\CvData::where('user_id', $user->id)->first();
            
            if (!$cvData) {
                return response()->json(['message' => 'No hay datos de CV Web'], 404);
            }

            return $this->generateCvPdfFromData($user, $cvData);
        } else {
            $filePath = storage_path('app/public/' . $application->resume);
            if (!file_exists($filePath)) {
                return response()->json(['message' => 'El archivo no existe'], 404);
            }
            
            $fileName = basename($filePath);
            return response()->download($filePath, $fileName, [
                'Access-Control-Expose-Headers' => 'Content-Disposition'
            ]);
        }
    }

    private function generateCvPdfFromData($user, $cvData)
    {
        try {
            // Asegurar que todos los directorios de caché necesarios existan
            $directories = [
                storage_path('fonts'),
                storage_path('app/temp'),
                storage_path('framework/views'),
                storage_path('framework/cache'),
                storage_path('framework/cache/data'),
                storage_path('framework/sessions'),
                storage_path('logs'),
                base_path('bootstrap/cache'),
            ];
            
            foreach ($directories as $dir) {
                if (!file_exists($dir)) {
                    mkdir($dir, 0755, true);
                }
            }
            
            $fontDir = storage_path('fonts');
            $tempDir = storage_path('app/temp');
            
            $options = [
                'font_dir' => $fontDir,
                'font_cache' => $fontDir,
                'temp_dir' => $tempDir,
            ];
            
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::setOptions($options)->loadView('cv.pdf', [
                'cvData' => $cvData,
                'user' => $user,
            ]);
            
            $fileName = 'CV_' . str_replace(' ', '_', $cvData->full_name) . '.pdf';
            return response()->streamDownload(function () use ($pdf) {
                echo $pdf->output();
            }, $fileName, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                'Access-Control-Expose-Headers' => 'Content-Disposition'
            ]);
        } catch (\Exception $e) {
            Log::error('Error generando PDF del CV en ApplicationController', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error al generar el PDF: ' . $e->getMessage()], 500);
        }
    }
} 