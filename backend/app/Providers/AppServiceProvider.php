<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Asegurar que todos los directorios de almacenamiento necesarios existan
        $this->ensureStorageDirectoriesExist();
    }

    /**
     * Asegurar que los directorios de almacenamiento necesarios existan
     */
    private function ensureStorageDirectoriesExist(): void
    {
        $directories = [
            storage_path('fonts'),
            storage_path('app/temp'),
            storage_path('app/public'),
            storage_path('app/public/profile_pictures'),
            storage_path('framework/views'),
            storage_path('framework/cache'),
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('logs'),
            base_path('bootstrap/cache'),
        ];

        foreach ($directories as $dir) {
            if (!file_exists($dir)) {
                @mkdir($dir, 0755, true);
            }
        }
    }
}
