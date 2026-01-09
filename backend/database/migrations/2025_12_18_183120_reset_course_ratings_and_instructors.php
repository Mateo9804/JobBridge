<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('courses')->update([
            'rating' => 0,
            'ratings_count' => 0,
            'instructor' => null,
            'enrollments_count' => 0
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hay vuelta atrás para el reseteo de datos de prueba
    }
};
