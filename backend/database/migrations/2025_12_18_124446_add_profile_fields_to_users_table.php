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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_profile_complete')->default(false);
            $table->string('education_level')->nullable();
            $table->json('skills')->nullable();
            $table->json('technologies')->nullable();
            $table->string('experience_years')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_profile_complete', 'education_level', 'skills', 'technologies', 'experience_years']);
        });
    }
};
