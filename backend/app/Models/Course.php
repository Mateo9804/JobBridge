<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'level',
        'type',
        'duration',
        'instructor',
        'lessons',
        'price',
        'image_url',
        'requirements',
        'what_you_will_learn',
        'enrollments_count',
        'rating',
        'ratings_count',
        'is_active',
    ];

    protected $casts = [
        'lessons' => 'array',
        'price' => 'decimal:2',
        'rating' => 'float',
        'is_active' => 'boolean',
    ];

    // Obtener los usuarios inscritos en este curso
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    // Verificar si un usuario está inscrito

    public function isEnrolledBy($userId)
    {
        return $this->enrollments()->where('user_id', $userId)->exists();
    }

    // Obtener el progreso de un usuario en este curso

    public function getProgressForUser($userId)
    {
        $enrollment = $this->enrollments()->where('user_id', $userId)->first();
        return $enrollment ? $enrollment->progress_percentage : 0;
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function updateRating()
    {
        $this->rating = $this->reviews()->avg('rating') ?: 0;
        $this->ratings_count = $this->reviews()->count();
        $this->save();
    }
}
