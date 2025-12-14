<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cv_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Información personal
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('nationality')->nullable();
            $table->text('professional_summary')->nullable();
            
            // Experiencia laboral (JSON)
            $table->json('work_experience')->nullable();
            
            // Educación (JSON)
            $table->json('education')->nullable();
            
            // Habilidades (JSON)
            $table->json('skills')->nullable();
            
            // Idiomas (JSON)
            $table->json('languages')->nullable();
            
            // Certificaciones (JSON)
            $table->json('certifications')->nullable();
            
            // Referencias (JSON)
            $table->json('references')->nullable();
            
            // Otros datos adicionales
            $table->json('additional_info')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cv_data');
    }
};
