<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GeocodingService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class GeocodingController extends Controller
{
    protected $geocodingService;

    public function __construct(GeocodingService $geocodingService)
    {
        $this->geocodingService = $geocodingService;
    }

    /**
     * Valida una dirección usando API externa
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $isValid = $this->geocodingService->validateAddress($request->address);

            return response()->json([
                'valid' => $isValid,
                'address' => $request->address,
            ]);
        } catch (\Exception $e) {
            Log::error('Error validating address', [
                'address' => $request->address,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'valid' => false,
                'error' => 'Error al validar la dirección'
            ], 500);
        }
    }

    /**
     * Geocodifica una dirección usando API externa
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function geocode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $geocode = $this->geocodingService->geocodeAddress($request->address);

            if ($geocode) {
                return response()->json([
                    'success' => true,
                    'data' => $geocode,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No se pudo geocodificar la dirección'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error geocoding address', [
                'address' => $request->address,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al geocodificar la dirección'
            ], 500);
        }
    }
}

