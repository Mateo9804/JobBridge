<?php

namespace App\Exceptions;

use Exception;

/**
 * Excepción personalizada para cuando un curso no está disponible
 */
class CourseNotAvailableException extends Exception
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
            'message' => 'Este curso no está disponible',
            'error_code' => 'COURSE_NOT_AVAILABLE'
        ], 400);
    }
}

