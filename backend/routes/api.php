<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;

Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

Route::get('/cors-test', function () {
    return response()->json([
        'message' => 'CORS test successful',
        'timestamp' => now(),
        'headers' => request()->headers->all()
    ]);
});

Route::get('/test-db', function () {
    try {
        \DB::connection()->getPdo();
        return response()->json(['message' => 'Database connection successful']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
    }
});

Route::get('/test-jobs', function () {
    try {
        $jobs = \App\Models\Job::all();
        return response()->json(['jobs' => $jobs, 'count' => $jobs->count()]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::get('/create-test-job', function () {
    try {
        $job = \App\Models\Job::create([
            'title' => 'Desarrollador Frontend React',
            'company' => 'TechCorp',
            'location' => 'Madrid, España',
            'category' => 'frontend',
            'experience' => 'junior',
            'salary_min' => 25000,
            'salary_max' => 35000,
            'description' => 'Buscamos un desarrollador Frontend con experiencia en React.',
            'skills' => 'React, JavaScript, CSS, HTML',
            'type' => 'Remoto',
            'user_id' => 1,
        ]);
        return response()->json(['message' => 'Trabajo de prueba creado', 'job' => $job]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas para trabajos
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/company/jobs', [JobController::class, 'companyJobs']);
Route::post('/jobs', [JobController::class, 'store']);
Route::get('/jobs/{job}', [JobController::class, 'show']);
Route::put('/jobs/{job}', [JobController::class, 'update']);
Route::delete('/jobs/{job}', [JobController::class, 'destroy']);

// Rutas para aplicaciones
Route::post('/applications', [ApplicationController::class, 'store']);

// Rutas protegidas para perfil de usuario
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'getProfile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
});

// Ruta pública para ver perfil de empresa
Route::get('/company/{id}/profile', [AuthController::class, 'getCompanyProfile']);