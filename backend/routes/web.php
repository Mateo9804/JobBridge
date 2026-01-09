<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use App\Models\Course;
use App\Models\Enrollment;

Route::get('/', function () {
    try {
        // Estadísticas de usuarios
        $totalUsers = User::count();
        $usersWithRole = User::where('role', 'user')->count();
        $companiesCount = User::where('role', 'company')->count();
        $usersPremium = User::where('plan', 'professional')->count();
        $usersWithCompleteProfile = User::where('is_profile_complete', true)->count();
        
        // Estadísticas de trabajos
        $totalJobs = Job::count();
        $activeJobs = Job::where('status', 'open')->count();
        $closedJobs = Job::where('status', 'closed')->count();
        
        // Estadísticas de aplicaciones
        $totalApplications = Application::count();
        $pendingApplications = Application::where('status', 'pending')->count();
        $acceptedApplications = Application::where('status', 'accepted')->count();
        $rejectedApplications = Application::where('status', 'rejected')->count();
        
        // Estadísticas de cursos
        $totalCourses = Course::count();
        $freeCourses = Course::where('type', 'free')->count();
        $premiumCourses = Course::where('type', 'premium')->count();
        $totalEnrollments = Enrollment::count();
        
        // Usuarios recientes (últimos 5)
        $recentUsers = User::orderBy('created_at', 'desc')
            ->take(5)
            ->select('id', 'name', 'email', 'role', 'plan', 'created_at')
            ->get();
        
        // Trabajos recientes (últimos 5)
        $recentJobs = Job::orderBy('created_at', 'desc')
            ->take(5)
            ->select('id', 'title', 'company', 'location', 'status', 'created_at')
            ->get();
        
        return response()->json([
            'message' => 'JobBridge API - Dashboard',
            'statistics' => [
                'users' => [
                    'total' => $totalUsers,
                    'regular_users' => $usersWithRole,
                    'companies' => $companiesCount,
                    'premium_users' => $usersPremium,
                    'with_complete_profile' => $usersWithCompleteProfile,
                ],
                'jobs' => [
                    'total' => $totalJobs,
                    'active' => $activeJobs,
                    'closed' => $closedJobs,
                ],
                'applications' => [
                    'total' => $totalApplications,
                    'pending' => $pendingApplications,
                    'accepted' => $acceptedApplications,
                    'rejected' => $rejectedApplications,
                ],
                'courses' => [
                    'total' => $totalCourses,
                    'free' => $freeCourses,
                    'premium' => $premiumCourses,
                    'total_enrollments' => $totalEnrollments,
                ],
            ],
            'recent_activity' => [
                'recent_users' => $recentUsers,
                'recent_jobs' => $recentJobs,
            ],
            'endpoints' => [
                'api_base' => '/api',
                'test' => '/api/test',
                'jobs' => '/api/jobs',
                'courses' => '/api/courses',
                'users' => '/api/profile (requiere autenticación)',
            ],
        ], 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al obtener estadísticas',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

Route::get('/login', function () {
    return response()->json(['message' => 'No autenticado'], 401);
})->name('login');

Route::get('/storage/{path}', function ($path) {
    $path = urldecode($path);
    $filePath = storage_path('app/public/' . $path);
    
    Log::info('Serving file from storage', [
        'requested_path' => $path,
        'full_path' => $filePath,
        'exists' => file_exists($filePath)
    ]);
    
    if (!file_exists($filePath)) {
        Log::warning('File not found in storage', ['path' => $filePath]);
        abort(404, 'File not found: ' . $path);
    }
    
    $file = file_get_contents($filePath);
    $type = mime_content_type($filePath);
    
    return response($file, 200)
        ->header('Content-Type', $type)
        ->header('Content-Disposition', 'inline; filename="' . basename($filePath) . '"')
        ->header('Cache-Control', 'public, max-age=31536000');
})->where('path', '.*');
