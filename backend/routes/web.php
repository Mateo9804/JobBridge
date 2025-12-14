<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
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
