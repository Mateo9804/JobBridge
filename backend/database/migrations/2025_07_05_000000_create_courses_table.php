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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('category'); // frontend, backend, fullstack, mobile, devops, etc.
            $table->string('level'); // beginner, intermediate, advanced
            $table->enum('type', ['free', 'premium'])->default('free');
            $table->string('duration')->nullable(); // "4 weeks", "8 hours", etc.
            $table->text('instructor')->nullable(); // Nombre del instructor
            $table->json('lessons')->nullable(); // Array de lecciones
            $table->decimal('price', 8, 2)->default(0.00);
            $table->string('image_url')->nullable();
            $table->text('requirements')->nullable(); // Prerrequisitos
            $table->text('what_you_will_learn')->nullable(); // Lo que aprenderás
            $table->integer('enrollments_count')->default(0);
            $table->float('rating')->default(0.0);
            $table->integer('ratings_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
