<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class JobTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de listado de trabajos
     */
    public function test_can_list_jobs(): void
    {
        Job::factory()->count(5)->create();

        $response = $this->getJson('/api/jobs');

        $response->assertStatus(200)
                 ->assertJsonCount(5);
    }

    /**
     * Test de creación de trabajo (requiere autenticación)
     */
    public function test_authenticated_company_can_create_job(): void
    {
        $company = User::factory()->create([
            'role' => 'company',
            'plan' => 'professional'
        ]);

        Sanctum::actingAs($company);

        $response = $this->postJson('/api/jobs', [
            'title' => 'Desarrollador PHP',
            'company' => 'Test Company',
            'location' => 'Madrid',
            'category' => 'Backend',
            'experience' => 'Junior',
            'salaryMin' => 30000,
            'salaryMax' => 40000,
            'description' => 'Descripción del trabajo',
            'skills' => ['PHP', 'Laravel'],
            'type' => 'full-time',
            'vacancies' => 1
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'id',
                     'title',
                     'company',
                     'location'
                 ]);

        $this->assertDatabaseHas('jobs', [
            'title' => 'Desarrollador PHP',
            'user_id' => $company->id
        ]);
    }

    /**
     * Test de que usuarios no autenticados no pueden crear trabajos
     */
    public function test_unauthenticated_user_cannot_create_job(): void
    {
        $response = $this->postJson('/api/jobs', [
            'title' => 'Desarrollador PHP',
            'company' => 'Test Company',
            'location' => 'Madrid',
            'category' => 'Backend',
            'experience' => 'Junior',
            'salaryMin' => 30000,
            'salaryMax' => 40000,
            'description' => 'Descripción del trabajo',
            'skills' => ['PHP', 'Laravel'],
            'type' => 'full-time'
        ]);

        $response->assertStatus(401);
    }
}

