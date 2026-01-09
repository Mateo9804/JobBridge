<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Servicio para validar y geocodificar direcciones usando API externa
 * Utiliza OpenStreetMap Nominatim API (gratuita y sin API key)
 */
class GeocodingService
{
    /**
     * URL base de la API de Nominatim
     */
    private const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

    /**
     * Valida y geocodifica una dirección
     *
     * @param string $address Dirección a validar
     * @return array|null Datos de geocodificación o null si no se encuentra
     */
    public function geocodeAddress(string $address): ?array
    {
        try {
            $response = Http::timeout(5)->get(self::NOMINATIM_API_URL, [
                'q' => $address,
                'format' => 'json',
                'limit' => 1,
                'addressdetails' => 1,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (!empty($data) && isset($data[0])) {
                    $result = $data[0];
                    
                    return [
                        'latitude' => floatval($result['lat'] ?? 0),
                        'longitude' => floatval($result['lon'] ?? 0),
                        'display_name' => $result['display_name'] ?? $address,
                        'address' => $result['address'] ?? [],
                        'valid' => true,
                    ];
                }
            }

            Log::warning('Geocodificación fallida', ['address' => $address]);
            return null;
        } catch (\Exception $e) {
            Log::error('Error en geocodificación', [
                'address' => $address,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Valida si una dirección es válida
     *
     * @param string $address Dirección a validar
     * @return bool true si la dirección es válida
     */
    public function validateAddress(string $address): bool
    {
        $geocode = $this->geocodeAddress($address);
        return $geocode !== null && ($geocode['valid'] ?? false);
    }

    /**
     * Obtiene las coordenadas de una dirección
     *
     * @param string $address Dirección
     * @return array|null Array con 'lat' y 'lon' o null
     */
    public function getCoordinates(string $address): ?array
    {
        $geocode = $this->geocodeAddress($address);
        
        if ($geocode && isset($geocode['latitude']) && isset($geocode['longitude'])) {
            return [
                'lat' => $geocode['latitude'],
                'lon' => $geocode['longitude'],
            ];
        }
        
        return null;
    }
}

