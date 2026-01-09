<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'company_name',
        'profile_picture',
        'cv',
        'description',
        'is_working',
        'logo',
        'website',
        'location',
        'industry',
        'plan',
        'is_profile_complete',
        'education_level',
        'skills',
        'technologies',
        'experience_years',
        'full_name',
        'first_name',
        'last_name',
        'phone',
        'nationality',
        'birthday',
        'languages',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_profile_complete' => 'boolean',
            'skills' => 'array',
            'technologies' => 'array',
            'languages' => 'array',
        ];
    }

    public function jobFavorites()
    {
        return $this->hasMany(\App\Models\JobFavorite::class);
    }
}
