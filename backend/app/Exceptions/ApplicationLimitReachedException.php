<?php

namespace App\Exceptions;

use Exception;

/**
 * Excepción personalizada para cuando se alcanza el límite de postulaciones
 */
class ApplicationLimitReachedException extends Exception
{
    /**
     * Renderiza la excepción como respuesta HTTP
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request)
    {
        return response()->json([
            'message' => 'Has alcanzado el límite de postulaciones permitidas',
            'error_code' => 'APPLICATION_LIMIT_REACHED'
        ], 429);
    }
}

