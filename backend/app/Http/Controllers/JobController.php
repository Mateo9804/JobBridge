<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JobController extends Controller
{
    /**
     * Format job data for API response.
     */
    private function formatJob($job)
    {
        $jobData = $job->toArray();
        
        // Asegurar que skills sea siempre un array
        if (isset($jobData['skills'])) {
            if (is_array($jobData['skills'])) {
                // Ya es un array
            } elseif (is_string($jobData['skills'])) {
                try {
                    $jobData['skills'] = json_decode($jobData['skills'], true) ?: [];
                } catch (\Exception $e) {
                    $jobData['skills'] = [$jobData['skills']];
                }
            } else {
                $jobData['skills'] = [];
            }
        } else {
            $jobData['skills'] = [];
        }
        
        return $jobData;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            Log::info('JobController@index called');
            
            // Si se solicita trabajos de una empresa específica
            if ($request->has('company_id')) {
                $jobs = Job::where('user_id', $request->company_id)->get();
            } else {
                // Mostrar todos los trabajos para la página de empleos
                $jobs = Job::all();
            }
            
            // Formatear cada job antes de devolver
            $formattedJobs = $jobs->map(function($job) {
                return $this->formatJob($job);
            });
            
            Log::info('Jobs retrieved successfully', ['count' => $jobs->count()]);
            return response()->json($formattedJobs);
        } catch (\Exception $e) {
            Log::error('Error in JobController@index', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener trabajos: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get jobs for the authenticated company.
     */
    public function companyJobs()
    {
        try {
            Log::info('JobController@companyJobs called');
            
            // Obtener el usuario autenticado o usar un usuario por defecto
            $userId = null;
            if (auth()->check()) {
                $userId = auth()->id();
                Log::info('User authenticated for company jobs', ['user_id' => $userId]);
            } else {
                // Si no hay autenticación, usar el primer usuario company que encontremos
                $companyUser = \App\Models\User::where('role', 'company')->first();
                if ($companyUser) {
                    $userId = $companyUser->id;
                    Log::info('Using default company user for company jobs', ['user_id' => $userId]);
                } else {
                    Log::error('No company users found in database');
                    return response()->json(['error' => 'No se encontró usuario de empresa válido'], 500);
                }
            }
            
            // Obtener trabajos de la empresa específica
            $jobs = Job::where('user_id', $userId)->get();
            
            // Formatear cada job antes de devolver
            $formattedJobs = $jobs->map(function($job) {
                return $this->formatJob($job);
            });
            
            Log::info('Company jobs retrieved successfully', ['count' => $jobs->count(), 'user_id' => $userId]);
            return response()->json($formattedJobs);
        } catch (\Exception $e) {
            Log::error('Error in JobController@companyJobs', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener trabajos de empresa: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('JobController@store called', ['data' => $request->all()]);
            
            $validationRules = [
                'title' => 'required|string|max:255',
                'company' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'experience' => 'required|string|max:255',
                'salaryMin' => 'required|integer|min:0',
                'salaryMax' => 'required|integer|min:0|gte:salaryMin',
                'description' => 'required|string',
                'skills' => 'required',
                'type' => 'required|string|max:255',
            ];

            Log::info('Validation rules', $validationRules);
            Log::info('Request data types', array_map('gettype', $request->all()));

            $validator = Validator::make($request->all(), $validationRules);

            if ($validator->fails()) {
                Log::warning('Validation failed', ['errors' => $validator->errors()]);
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Obtener el usuario autenticado o usar un usuario por defecto
            $userId = null;
            if (auth()->check()) {
                $userId = auth()->id();
                Log::info('User authenticated', ['user_id' => $userId]);
            } else {
                // Si no hay autenticación, usar el primer usuario company que encontremos
                $companyUser = \App\Models\User::where('role', 'company')->first();
                if ($companyUser) {
                    $userId = $companyUser->id;
                    Log::info('Using default company user', ['user_id' => $userId]);
                } else {
                    Log::error('No company users found in database');
                    return response()->json(['error' => 'No se encontró usuario de empresa válido'], 500);
                }
            }

            // Verificar límite de 2 ofertas por empresa
            $existingJobsCount = Job::where('user_id', $userId)->count();
            if ($existingJobsCount >= 2) {
                Log::warning('Company job limit reached', ['user_id' => $userId, 'current_jobs' => $existingJobsCount]);
                return response()->json([
                    'error' => 'Límite de ofertas alcanzado',
                    'message' => 'Has alcanzado el límite de 2 ofertas de trabajo gratuitas. Para publicar más ofertas, suscríbete a nuestro plan premium por $2.99/mes.',
                    'limit_reached' => true,
                    'current_jobs' => $existingJobsCount
                ], 403);
            }

            // Procesar skills - puede ser string o array
            $skills = $request->skills;
            if (is_array($skills)) {
                $skills = json_encode($skills);
            }

            $jobData = [
                'title' => $request->title,
                'company' => $request->company,
                'location' => $request->location,
                'category' => $request->category,
                'experience' => $request->experience,
                'salary_min' => $request->salaryMin,
                'salary_max' => $request->salaryMax,
                'description' => $request->description,
                'skills' => $skills,
                'type' => $request->type,
                'user_id' => $userId,
            ];

            Log::info('Creating job with data', $jobData);
            
            $job = Job::create($jobData);
            
            Log::info('Job created successfully', ['job_id' => $job->id]);
            return response()->json($this->formatJob($job), 201);
        } catch (\Exception $e) {
            Log::error('Error in JobController@store', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al crear trabajo: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        try {
            return response()->json($this->formatJob($job));
        } catch (\Exception $e) {
            Log::error('Error in JobController@show', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener trabajo: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Job $job)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'company' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'experience' => 'required|string|max:255',
                'salaryMin' => 'required|integer|min:0',
                'salaryMax' => 'required|integer|min:0|gte:salaryMin',
                'description' => 'required|string',
                'skills' => 'required',
                'type' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Procesar skills - puede ser string o array
            $skills = $request->skills;
            if (is_array($skills)) {
                $skills = json_encode($skills);
            }

            $job->update([
                'title' => $request->title,
                'company' => $request->company,
                'location' => $request->location,
                'category' => $request->category,
                'experience' => $request->experience,
                'salary_min' => $request->salaryMin,
                'salary_max' => $request->salaryMax,
                'description' => $request->description,
                'skills' => $skills,
                'type' => $request->type,
            ]);

            return response()->json($this->formatJob($job));
        } catch (\Exception $e) {
            Log::error('Error in JobController@update', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al actualizar trabajo: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Job $job)
    {
        try {
            Log::info('JobController@destroy called', ['job_id' => $job->id]);
            
            $job->delete();
            
            Log::info('Job deleted successfully', ['job_id' => $job->id]);
            return response()->json(['message' => 'Job deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error in JobController@destroy', ['error' => $e->getMessage(), 'job_id' => $job->id]);
            return response()->json(['error' => 'Error al eliminar trabajo: ' . $e->getMessage()], 500);
        }
    }
} 