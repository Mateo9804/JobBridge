<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use App\Models\User;
use App\Models\CvData;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Registro iniciado', $request->all());
        
        try {
            $validationRules = [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:4',
                'role' => 'required|in:user,company',
            ];

            // Si el rol es company, agregar validación para company_name
            if ($request->role === 'company') {
                $validationRules['company_name'] = 'required|string|max:255';
            }

            $request->validate($validationRules);

            Log::info('Validación pasada');

            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ];

            // Agregar company_name si el rol es company
            if ($request->role === 'company') {
                $userData['company_name'] = $request->company_name;
            }

            // Usar transacción para garantizar integridad de datos
            $user = DB::transaction(function () use ($userData) {
                $user = User::create($userData);

                // Notificación para empresas al registrarse
                if ($user->role === 'company') {
                    \App\Models\Notification::createForUser($user->id, 'welcome', '¡Bienvenido a JobBridge!');
                }

                Log::info('Usuario creado', ['user_id' => $user->id]);

                return $user;
            });

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 201);
            
        } catch (ValidationException $e) {
            Log::warning('Error de validación en registro', ['errors' => $e->errors()]);
            
            // Verificar si el error es específicamente por email duplicado
            if (isset($e->errors()['email']) && in_array('The email has already been taken.', $e->errors()['email'])) {
                return response()->json([
                    'message' => 'Ya existe una cuenta con este email. ¿Ya tienes una cuenta?',
                    'error_type' => 'email_exists'
                ], 422);
            }
            
            // Para otros errores de validación
            return response()->json([
                'message' => 'Datos de registro inválidos',
                'errors' => $e->errors()
            ], 422);
            
        } catch (QueryException $e) {
            Log::error('Error de base de datos en registro', ['error' => $e->getMessage()]);
            
            // Verificar si es un error de clave duplicada (email)
            if ($e->getCode() == 23000 && strpos($e->getMessage(), 'users_email_unique') !== false) {
                return response()->json([
                    'message' => 'Ya existe una cuenta con este email. ¿Ya tienes una cuenta?',
                    'error_type' => 'email_exists'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Error en la base de datos. Inténtalo de nuevo.'
            ], 500);
            
        } catch (\Exception $e) {
            Log::error('Error inesperado en registro', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error al crear usuario. Inténtalo de nuevo.'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    //Obtener el perfil del usuario autenticado

    public function getProfile(Request $request)
    {
        $user = $request->user();
        $userData = $user->toArray();
        $userData['profile_picture_url'] = $user->profile_picture ? Storage::url($user->profile_picture) : null;
        return response()->json($userData);
    }

    
    // Actualizar el perfil del usuario autenticado
    
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        Log::info('Datos recibidos en updateProfile', $request->all());
        Log::info('Archivos recibidos', $request->allFiles());

        // Validar tamaño de archivos antes de procesar
        if ($request->hasFile('profile_picture')) {
            $request->validate([
                'profile_picture' => 'image|max:2048', // 2MB máximo
            ]);
        }
        
        if ($request->hasFile('logo')) {
            $request->validate([
                'logo' => 'image|max:2048', // 2MB máximo
            ]);
        }

        $data = $request->only(['name', 'company_name', 'description', 'website', 'location', 'industry', 'is_working']);

        // Actualizar campos comunes
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['company_name'])) {
            $user->company_name = $data['company_name'];
        }
        if (isset($data['description'])) {
            $user->description = $data['description'];
        }
        if (isset($data['website'])) {
            $user->website = $data['website'];
        }
        if (isset($data['location'])) {
            $user->location = $data['location'];
        }
        if (isset($data['industry'])) {
            $user->industry = $data['industry'];
        }
        if (isset($data['is_working'])) {
            $user->is_working = filter_var($data['is_working'], FILTER_VALIDATE_BOOLEAN);
        }

        // Subir foto de perfil (usuario)
        Log::info('Verificando profile_picture', [
            'hasFile' => $request->hasFile('profile_picture'),
            'allFiles' => array_keys($request->allFiles()),
            'user_id' => $user->id
        ]);
        
        if ($request->hasFile('profile_picture')) {
            Log::info('Archivo profile_picture detectado, iniciando guardado');
            $oldProfilePicture = $user->profile_picture;
            $disk = Storage::disk('public');
            
            try {
                $file = $request->file('profile_picture');
                Log::info('Datos del archivo recibido', [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                    'is_valid' => $file->isValid(),
                    'error' => $file->getError()
                ]);
                
                // Asegurar que el directorio exista
                $disk->makeDirectory('profile_pictures');
                
                // PRIMERO: Guardar la nueva imagen
                $path = $file->store('profile_pictures', 'public');
                Log::info('Resultado de store()', ['path' => $path, 'type' => gettype($path)]);
                
                // Validar que se guardó correctamente
                if (!$path || $path === false) {
                    throw new \Exception('El método store() retornó false o null');
                }
                
                if (!$disk->exists($path)) {
                    throw new \Exception('La imagen no se guardó correctamente - archivo no existe después de guardar');
                }
                
                Log::info('Nueva foto de perfil guardada correctamente', ['path' => $path]);
                
                // SEGUNDO: Solo ahora borrar la imagen anterior (si existe)
                if ($oldProfilePicture && $disk->exists($oldProfilePicture)) {
                    $disk->delete($oldProfilePicture);
                    Log::info('Imagen anterior eliminada', ['path' => $oldProfilePicture]);
                }
                
                // TERCERO: Actualizar el campo con la nueva ruta
                $user->profile_picture = $path;
                Log::info('Campo profile_picture asignado', ['path' => $path]);
                
            } catch (\Exception $e) {
                Log::error('Error al guardar foto de perfil: ' . $e->getMessage(), [
                    'trace' => $e->getTraceAsString(),
                    'file_info' => $request->hasFile('profile_picture') ? [
                        'original_name' => $request->file('profile_picture')->getClientOriginalName(),
                        'size' => $request->file('profile_picture')->getSize(),
                        'mime' => $request->file('profile_picture')->getMimeType(),
                    ] : null
                ]);
                
                // Si falló, intentar limpiar la nueva imagen (si se creó pero no se validó)
                if (isset($path) && $path && isset($disk) && $disk->exists($path)) {
                    try {
                        $disk->delete($path);
                    } catch (\Exception $cleanupException) {
                        Log::warning('Error al limpiar imagen fallida', ['error' => $cleanupException->getMessage()]);
                    }
                }
                
                return response()->json([
                    'message' => 'Error al guardar la foto de perfil: ' . $e->getMessage()
                ], 500);
            }
        } else {
            Log::info('No se detectó archivo profile_picture en la petición');
        }
        
        // Subir logo (empresa)
        if ($request->hasFile('logo')) {
            $oldLogo = $user->logo;
            $disk = Storage::disk('public');
            
            try {
                // Asegurar que el directorio exista
                $disk->makeDirectory('company_logos');
                
                // PRIMERO: Guardar la nueva imagen
                $file = $request->file('logo');
                Log::info('Archivo logo recibido', ['original_name' => $file->getClientOriginalName()]);
                $filename = 'company_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('company_logos', $filename, 'public');
                
                // Validar que se guardó correctamente
                if (!$path || $path === false) {
                    throw new \Exception('El método storeAs() retornó false o null');
                }
                
                if (!$disk->exists($path)) {
                    throw new \Exception('El logo no se guardó correctamente - archivo no existe después de guardar');
                }
                
                Log::info('Nuevo logo guardado correctamente', ['path' => $path]);
                
                // SEGUNDO: Solo ahora borrar el logo anterior (si existe)
                if ($oldLogo && $disk->exists($oldLogo)) {
                    $disk->delete($oldLogo);
                    Log::info('Logo anterior eliminado', ['path' => $oldLogo]);
                }
                
                // TERCERO: Actualizar el campo con la nueva ruta
                $user->logo = $path;
                
            } catch (\Exception $e) {
                Log::error('Error al guardar logo: ' . $e->getMessage(), [
                    'trace' => $e->getTraceAsString(),
                    'file_info' => [
                        'original_name' => $request->file('logo')->getClientOriginalName(),
                        'size' => $request->file('logo')->getSize(),
                        'mime' => $request->file('logo')->getMimeType(),
                    ]
                ]);
                
                // Si falló, intentar limpiar la nueva imagen (si se creó pero no se validó)
                if (isset($path) && $path && $disk->exists($path)) {
                    try {
                        $disk->delete($path);
                    } catch (\Exception $cleanupException) {
                        Log::warning('Error al limpiar logo fallido', ['error' => $cleanupException->getMessage()]);
                    }
                }
                
                return response()->json([
                    'message' => 'Error al guardar el logo: ' . $e->getMessage()
                ], 500);
            }
        }

        // Subir CV si viene (solo usuario)
        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $path = $file->store('cvs', 'public');
            $user->cv = $path;
        }

        // Si el usuario es empresa y cambia el nombre, actualizar en todos sus trabajos
        if ($user->role === 'company' && isset($data['company_name'])) {
            \App\Models\Job::where('user_id', $user->id)->update(['company' => $data['company_name']]);
        }

        Log::info('Antes de guardar usuario', [
            'user_id' => $user->id,
            'profile_picture' => $user->profile_picture,
            'dirty' => $user->getDirty(),
            'changes' => $user->getChanges()
        ]);
        
        $saveResult = $user->save();
        
        Log::info('Después de guardar usuario', [
            'save_result' => $saveResult,
            'user_id' => $user->id,
            'profile_picture' => $user->profile_picture,
            'was_changed' => $user->wasChanged('profile_picture')
        ]);
        
        \App\Models\Notification::createForUser($user->id, 'profile_update', 'Tu perfil ha sido actualizado correctamente.');
        Log::info('Usuario actualizado y guardado', [
            'user_id' => $user->id,
            'profile_picture' => $user->profile_picture,
            'name' => $user->name
        ]);
        
        // Recargar el usuario desde la BD para asegurar que tenemos los datos más recientes
        $user->refresh();
        
        Log::info('Después de refresh usuario', [
            'user_id' => $user->id,
            'profile_picture' => $user->profile_picture
        ]);
        
        $userData = $user->toArray();
        $userData['profile_picture_url'] = $user->profile_picture ? Storage::url($user->profile_picture) : null;
        
        return response()->json($userData);
    }

    // Descargar CV del usuario autenticado
     
    public function downloadCv(Request $request)
    {
        $user = $request->user();
        $user->refresh(); 
        
        // Obtener CV creado en la página
        $cvData = CvData::where('user_id', $user->id)->first();
        
        // Verificar cuál es el más reciente comparando fechas de actualización
        $hasUploadedCv = $user->cv && file_exists(storage_path('app/public/' . $user->cv));
        $hasCreatedCv = $cvData !== null;
        
        if ($hasUploadedCv && $hasCreatedCv) {
            $uploadedCvTime = filemtime(storage_path('app/public/' . $user->cv));
            
            // Para CV creado: usar la fecha de actualización del CV creado
            $createdCvTime = $cvData->updated_at ? $cvData->updated_at->timestamp : 0;
            
            Log::info('Comparando fechas de CV', [
                'uploaded_cv_time' => $uploadedCvTime,
                'created_cv_time' => $createdCvTime,
                'uploaded_cv_date' => date('Y-m-d H:i:s', $uploadedCvTime),
                'created_cv_date' => $cvData->updated_at ? $cvData->updated_at->toDateTimeString() : null,
            ]);
            
            // Si el CV creado es más reciente o igual, usar ese
            if ($createdCvTime >= $uploadedCvTime) {
                Log::info('Usando CV creado (más reciente)');
                return $this->generateCvPdfFromData($user, $cvData);
            } else {
                Log::info('Usando CV subido (más reciente)');
                $filePath = storage_path('app/public/' . $user->cv);
                $fileName = basename($filePath);
                $mimeType = mime_content_type($filePath);
                
                if (!$mimeType || $mimeType === 'application/octet-stream') {
                    $mimeType = 'application/pdf';
                }
                
                return response()->download($filePath, $fileName, [
                    'Content-Type' => $mimeType,
                    'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                ]);
            }
        } elseif ($hasUploadedCv) {
            $filePath = storage_path('app/public/' . $user->cv);
            $fileName = basename($filePath);
            $mimeType = mime_content_type($filePath);
            
            if (!$mimeType || $mimeType === 'application/octet-stream') {
                $mimeType = 'application/pdf';
            }
            
            return response()->download($filePath, $fileName, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            ]);
        } elseif ($hasCreatedCv) {
            return $this->generateCvPdfFromData($user, $cvData);
        }
        
        return response()->json(['message' => 'No hay CV disponible'], 404);
    }

    // Generar PDF del CV creado con foto de perfil
    
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
                    @mkdir($dir, 0755, true);
                }
                // Verificar permisos de escritura
                if (file_exists($dir) && !is_writable($dir)) {
                    @chmod($dir, 0755);
                }
            }
            
            // Limpiar caché de vistas para evitar problemas
            try {
                \Artisan::call('view:clear');
            } catch (\Exception $clearException) {
                Log::warning('No se pudo limpiar el caché de vistas', ['error' => $clearException->getMessage()]);
            }
            
            $fontDir = storage_path('fonts');
            $tempDir = storage_path('app/temp');
            
            $hasGd = extension_loaded('gd');
            
            if (!$hasGd) {
                Log::warning('GD extension no disponible, generando PDF sin imagen de perfil');
            }
            
            $options = [
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => false,
                'isPhpEnabled' => true,
                'font_dir' => $fontDir,
                'font_cache' => $fontDir,
                'temp_dir' => $tempDir,
            ];
            
            if (!$hasGd) {
                $options['enableImage'] = false;
            }
            
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
            Log::error('Error generando PDF del CV', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if (strpos($e->getMessage(), 'GD extension') !== false || strpos($e->getMessage(), 'cache path') !== false) {
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
                        bootstrap_path('cache'),
                    ];
                    
                    foreach ($directories as $dir) {
                        if (!file_exists($dir)) {
                            mkdir($dir, 0755, true);
                        }
                    }
                    
                    $fontDir = storage_path('fonts');
                    $tempDir = storage_path('app/temp');
                    
                    Log::info('Reintentando generación de PDF sin imagen debido a falta de GD o problema de caché');
                    $pdf = \Barryvdh\DomPDF\Facade\Pdf::setOptions([
                        'isHtml5ParserEnabled' => true,
                        'isRemoteEnabled' => false,
                        'isPhpEnabled' => true,
                        'enableImage' => false,
                        'font_dir' => $fontDir,
                        'font_cache' => $fontDir,
                        'temp_dir' => $tempDir,
                    ])->loadView('cv.pdf', [
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
                } catch (\Exception $e2) {
                    Log::error('Error en segundo intento de generación de PDF', [
                        'error' => $e2->getMessage()
                    ]);
                }
            }
            
            return response()->json(['message' => 'Error al generar el PDF: ' . $e->getMessage()], 500);
        }
    }
    public function getProfilePicture(Request $request)
    {
        try {
            $user = $request->user();
            
            Log::info('Serving profile picture', [
                'user_id' => $user->id,
                'profile_picture' => $user->profile_picture
            ]);
            
            if (!$user->profile_picture) {
                Log::warning('User has no profile picture');
                abort(404, 'No hay foto de perfil');
            }
            
            $filePath = storage_path('app/public/' . $user->profile_picture);
            
            Log::info('Looking for file', ['path' => $filePath, 'exists' => file_exists($filePath)]);
            
            if (!file_exists($filePath)) {
                Log::error('File not found', ['path' => $filePath]);
                abort(404, 'El archivo no existe: ' . $filePath);
            }
            
            $file = file_get_contents($filePath);
            $type = mime_content_type($filePath);
            
            if (!$type) {
                $type = 'image/png'; // Por defecto
            }
            
            Log::info('Serving file successfully', ['type' => $type, 'size' => strlen($file)]);
            
            return response($file, 200)
                ->header('Content-Type', $type)
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');
        } catch (\Exception $e) {
            Log::error('Error serving profile picture', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            abort(500, 'Error al servir la imagen: ' . $e->getMessage());
        }
    }

    public function getCompanyProfile($id)
    {
        $user = User::where('id', $id)->where('role', 'company')->firstOrFail();
        // Solo exponer campos públicos
        return response()->json([
            'id' => $user->id,
            'company_name' => $user->company_name,
            'logo' => $user->logo,
            'logo_url' => $user->logo ? Storage::url($user->logo) : null,
            'description' => $user->description,
            'website' => $user->website,
            'location' => $user->location,
            'industry' => $user->industry,
        ]);
    }
    public function getCvData(Request $request)
    {
        $user = $request->user();
        $cvData = CvData::where('user_id', $user->id)->first();
        
        if (!$cvData) {
            return response()->json(['message' => 'No hay datos de CV'], 404);
        }
        
        return response()->json($cvData);
    }

    public function saveCvData(Request $request)
    {
        try {
            $user = $request->user();
            
            $validated = $request->validate([
                'full_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:50',
                'address' => 'nullable|string|max:500',
                'birth_date' => 'nullable',
                'nationality' => 'nullable|string|max:100',
                'professional_summary' => 'nullable|string',
                'work_experience' => 'nullable|array',
                'education' => 'nullable|array',
                'skills' => 'nullable|array',
                'languages' => 'nullable|array',
                'certifications' => 'nullable|array',
                'references' => 'nullable|array',
                'additional_info' => 'nullable|array',
            ]);

            // Normalizar fecha para la BD
            if (isset($validated['birth_date']) && $validated['birth_date']) {
                $validated['birth_date'] = date('Y-m-d', strtotime($validated['birth_date']));
            }

            $cvData = CvData::updateOrCreate(
                ['user_id' => $user->id],
                $validated
            );
            
            // Sincronizar con el modelo User para el panel de búsqueda de empresas
            if (isset($validated['skills'])) {
                $user->skills = $validated['skills'];
                $user->technologies = $validated['skills'];
            }
            
            if (isset($validated['languages'])) {
                $user->languages = $validated['languages'];
            }
            
            if (isset($validated['full_name'])) $user->full_name = $validated['full_name'];
            if (isset($validated['phone'])) $user->phone = $validated['phone'];
            if (isset($validated['nationality'])) $user->nationality = $validated['nationality'];
            if (isset($validated['birth_date']) && $validated['birth_date']) {
                $user->birthday = $validated['birth_date'];
            }
            
            $user->is_profile_complete = true;
            $user->save();
            
            $cvData->touch();
            $cvData->refresh();

            return response()->json([
                'cv_data' => $cvData,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error al guardar CV Data: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json([
                'message' => 'Error interno al guardar los datos del CV: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateCvPdf(Request $request)
    {
        $user = $request->user();
        $cvData = CvData::where('user_id', $user->id)->first();
        
        if (!$cvData) {
            return response()->json(['message' => 'No hay datos de CV para generar'], 404);
        }
        return response()->json([
            'message' => 'Generación de PDF pendiente de implementación',
            'cv_data' => $cvData
        ]);
    }

    // Actualizar plan del usuario
    public function updatePlan(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:free,professional',
        ]);

        $user = $request->user();
        $newPlan = $request->plan;

        // Si ya tiene el plan profesional, no hacer nada
        if ($user->plan === 'professional' && $newPlan === 'professional') {
            return response()->json([
                'message' => 'Ya tienes el plan profesional activo',
                'user' => $user
            ]);
        }

        $user->plan = $newPlan;
        $user->save();

        // Crear notificación
        $planName = $newPlan === 'professional' ? 'Plan Profesional' : 'Plan Gratuito';
        \App\Models\Notification::createForUser(
            $user->id,
            'plan_update',
            "Tu plan ha sido actualizado a {$planName}."
        );

        Log::info('Plan actualizado', [
            'user_id' => $user->id,
            'old_plan' => $user->getOriginal('plan'),
            'new_plan' => $newPlan
        ]);

        return response()->json([
            'message' => 'Plan actualizado correctamente',
            'user' => $user
        ]);
    }
}
