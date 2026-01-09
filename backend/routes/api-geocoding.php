<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GeocodingController;

/*
|--------------------------------------------------------------------------
| API Routes - Geocoding (API Externa)
|--------------------------------------------------------------------------
*/

Route::prefix('geocoding')->group(function () {
    Route::post('/validate', [GeocodingController::class, 'validateAddress']);
    Route::post('/geocode', [GeocodingController::class, 'geocode']);
});

