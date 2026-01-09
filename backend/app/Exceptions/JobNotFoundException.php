<?php

namespace App\Exceptions;

use Exception;

/**
 * Excepción personalizada para cuando un trabajo no se encuentra
 */
class JobNotFoundException extends Exception
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
            'message' => 'Trabajo no encontrado',
            'error_code' => 'JOB_NOT_FOUND'
        ], 404);
    }
}

