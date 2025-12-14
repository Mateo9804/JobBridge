<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JobController extends Controller
{
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

    public function index(Request $request)
    {
        try {
            Log::info('JobController@index called');

            $query = Job::query();

            if ($request->has('company_id')) {
                $query->where('user_id', $request->company_id);
            }

            if ($request->filled('category') && $request->category !== 'todos') {
                $query->where('category', $request->category);
            }

            if ($request->filled('experience') && $request->experience !== 'todos') {
                $query->where('experience', $request->experience);
            }

            if ($request->filled('location') && $request->location !== 'todos') {
                $query->where('location', $request->location);
            }

            $jobs = $query->get();

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
    public function companyJobs()
    {
        try {
            Log::info('JobController@companyJobs called');
            
            if (!Auth::check()) {
                Log::warning('Intento de acceso a companyJobs sin autenticación');
                return response()->json(['error' => 'No autenticado'], 401);
            }
            $userId = Auth::id();
            Log::info('User authenticated for company jobs', ['user_id' => $userId]);
            
            $jobs = Job::where('user_id', $userId)->get();
            
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

            if (!Auth::check()) {
                Log::warning('Intento de crear trabajo sin autenticación');
                return response()->json(['error' => 'No autenticado'], 401);
            }
            $userId = Auth::id();
            Log::info('User authenticated', ['user_id' => $userId]);

            /** @var \App\Models\User|null $user */
            $user = Auth::user();

            if ($user && $user->role === 'company' && $user->plan === 'free') {
                $totalJobs = Job::where('user_id', $userId)->count();

                // Límite de 2 ofertas totales para plan gratuito (no por mes, total)
                if ($totalJobs >= 2) {
                    return response()->json([
                        'message' => 'Has alcanzado el límite de 2 ofertas de trabajo (Plan gratuito). La opción de publicar más ofertas todavía no está disponible.',
                        'limit_reached' => true
                    ], 403);
                }
            }

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
            
            \App\Models\Notification::createForUser($userId, 'job_created', 'Has publicado un nuevo trabajo: ' . $job->title);
            Log::info('Job created successfully', ['job_id' => $job->id]);
            return response()->json($this->formatJob($job), 201);
        } catch (\Exception $e) {
            Log::error('Error in JobController@store', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al crear trabajo: ' . $e->getMessage()], 500);
        }
    }

    public function show(Job $job)
    {
        try {
            return response()->json($this->formatJob($job));
        } catch (\Exception $e) {
            Log::error('Error in JobController@show', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener trabajo: ' . $e->getMessage()], 500);
        }
    }
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
    public function destroy(Job $job)
    {
        try {
            Log::info('JobController@destroy called', ['job_id' => $job->id]);
            
            $job->delete();
            
            \App\Models\Notification::createForUser($job->user_id, 'job_deleted', 'Has eliminado el trabajo: ' . $job->title);
            Log::info('Job deleted successfully', ['job_id' => $job->id]);
            return response()->json(['message' => 'Job deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error in JobController@destroy', ['error' => $e->getMessage(), 'job_id' => $job->id]);
            return response()->json(['error' => 'Error al eliminar trabajo: ' . $e->getMessage()], 500);
        }
    }
} 