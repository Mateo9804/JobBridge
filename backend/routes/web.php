<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
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

Route::get('/storage/{path}', function (string $path) {
    $path = ltrim($path, '/');
    
    if ($path === '' || str_contains($path, '..')) {
        abort(404);
    }
    
    $disk = Storage::disk('public');
    
    if (!$disk->exists($path)) {
        abort(404);
    }
    
    // Use a streamed response to avoid "403 Forbidden" issues on some Windows/PHP setups
    // when serving files outside `public/` with `response()->file(...)`.
    $mime = $disk->mimeType($path) ?: 'application/octet-stream';
    $size = $disk->size($path);
    $stream = $disk->readStream($path);
    
    if ($stream === false) {
        abort(404);
    }
    
    return response()->stream(function () use ($stream) {
        fpassthru($stream);
        fclose($stream);
    }, 200, [
        'Content-Type' => $mime,
        'Content-Length' => (string) $size,
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');
