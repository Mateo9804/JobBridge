<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;

// Incluir rutas de geocodificación (API externa)
require __DIR__ . '/api-geocoding.php';

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
        DB::connection()->getPdo();
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
Route::middleware('auth:sanctum')->get('/company/jobs', [JobController::class, 'companyJobs']);
Route::middleware('auth:sanctum')->post('/jobs', [JobController::class, 'store']);
Route::get('/jobs/{job}', [JobController::class, 'show']);
Route::put('/jobs/{job}', [JobController::class, 'update']);
Route::delete('/jobs/{job}', [JobController::class, 'destroy']);

// Rutas protegidas para perfil de usuario
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'getProfile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/profile/cv', [AuthController::class, 'downloadCv']);
    Route::get('/profile/picture', [AuthController::class, 'getProfilePicture']);
    Route::get('/profile/cv-data', [AuthController::class, 'getCvData']);
    Route::post('/profile/cv-data', [AuthController::class, 'saveCvData']);
    Route::post('/profile/cv-data/generate-pdf', [AuthController::class, 'generateCvPdf']);

    // Notificaciones del usuario autenticado
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Postulaciones de un trabajo (solo empresa dueña)
    Route::get('/jobs/{job}/applications', [\App\Http\Controllers\ApplicationController::class, 'jobApplications']);

    // Crear postulación (protegido)
    Route::post('/applications', [ApplicationController::class, 'store']);

    // Postulaciones del usuario autenticado
    Route::get('/user/applications', [ApplicationController::class, 'userApplications']);

    // Eliminar postulación (solo empresa dueña del trabajo)
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);

    // Obtener todas las postulaciones de los trabajos publicados por la empresa
    Route::get('/company/applications', [ApplicationController::class, 'companyApplications']);
    Route::patch('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
    Route::post('/applications/{id}/notify-cv-view', [ApplicationController::class, 'notifyCvView']);
    Route::get('/applications/{id}/download-cv', [ApplicationController::class, 'downloadApplicationCv']);
});

// Ruta pública para ver perfil de empresa
Route::get('/company/{id}/profile', [AuthController::class, 'getCompanyProfile']);

// Rutas para cursos
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);
Route::get('/courses/{course}/reviews', [CourseController::class, 'getReviews']);

// Rutas protegidas para cursos (solo usuarios)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses/{course}/enroll', [CourseController::class, 'enroll']);
    Route::post('/courses/{course}/review', [CourseController::class, 'addReview']);
    Route::get('/user/courses', [CourseController::class, 'myCourses']);
    Route::post('/enrollments/{enrollment}/complete-lesson', [CourseController::class, 'completeLesson']);
    Route::get('/enrollments/{enrollment}/progress', [CourseController::class, 'getProgress']);
    
    // Actualizar plan del usuario
    Route::post('/profile/update-plan', [AuthController::class, 'updatePlan']);

    // Perfil profesional y gestión de usuarios
    Route::post('/profile/complete', [UserController::class, 'completeProfile']);
    Route::get('/company/official-users', [UserController::class, 'getOfficialUsers']);
    Route::get('/user/{id}/profile-picture', [UserController::class, 'getUserProfilePicture']);

    // Favoritos de trabajos
    Route::post('/jobs/{job}/favorite', [JobController::class, 'toggleFavorite']);
    Route::get('/user/favorites', [JobController::class, 'getUserFavorites']);
});