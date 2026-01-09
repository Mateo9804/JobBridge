<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Handle preflight OPTIONS requests
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // Orígenes permitidos (separados por coma). Ej:
        // CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
        $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')))));
        $requestOrigin = $request->headers->get('Origin');

        // Si el request trae Origin y está permitido, devolvemos ese Origin (necesario cuando Allow-Credentials=true)
        $originToSet = $allowedOrigins[0] ?? 'http://localhost:3000';
        if ($requestOrigin && in_array($requestOrigin, $allowedOrigins, true)) {
            $originToSet = $requestOrigin;
        }

        $response->headers->set('Access-Control-Allow-Origin', $originToSet);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400'); // 24 hours

        return $response;
    }
}
