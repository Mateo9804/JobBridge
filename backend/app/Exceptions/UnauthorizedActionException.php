<?php

namespace App\Exceptions;

use Exception;

/**
 * Excepción personalizada para acciones no autorizadas
 */
class UnauthorizedActionException extends Exception
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
            'message' => 'No tienes autorización para realizar esta acción',
            'error_code' => 'UNAUTHORIZED_ACTION'
        ], 403);
    }
}

