<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Job;

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
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            
            $cvPath = '';
            if ($request->hasFile('cv')) {
                $cvPath = $request->file('cv')->store('cvs', 'public');
            }

            $userId = Auth::id();
            /** @var \App\Models\User|null $user */
            $user = Auth::user();
            
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
            // No permitir más de 2 postulaciones en total (versión gratuita)
            if ($user && $user->role === 'user' && $user->plan === 'free') {
                $recentApplications = Application::where('user_id', $userId)
                    ->where('created_at', '>=', now()->subMonth())
                    ->count();

                if ($recentApplications >= 2) {
                    return response()->json(['message' => 'Has alcanzado el límite de 2 postulaciones por mes en el plan gratuito.'], 403);
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

            return response()->json($application, 201);
        } catch (\Exception $e) {
            file_put_contents(base_path('test_log.txt'), "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n", FILE_APPEND);
            return response()->json(['message' => 'Error interno al procesar la postulación.'], 500);
        }
    }
    public function userApplications()
    {
        $applications = Application::where('user_id', Auth::id())
            ->with('job')
            ->orderBy('created_at', 'desc')
            ->get();

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
                    'created_at' => $application->created_at,
                ];
            }
        }
        return response()->json($applications);
    }
} 