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
        // description ya existe en create_users_table, no la agregamos de nuevo
        if (!Schema::hasColumn('users', 'company_name')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('company_name')->nullable()->after('role');
            });
        }
        if (!Schema::hasColumn('users', 'logo')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('logo')->nullable();
            });
        }
        if (!Schema::hasColumn('users', 'website')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('website')->nullable();
            });
        }
        if (!Schema::hasColumn('users', 'location')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('location')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('company_name');
            $table->dropColumn(['logo', 'description', 'website', 'location']);
        });
    }
};
