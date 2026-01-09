<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseProgress extends Model
{
    use HasFactory;

    protected $table = 'course_progress';

    protected $fillable = [
        'enrollment_id',
        'user_id',
        'course_id',
        'lesson_id',
        'is_completed',
        'time_spent',
        'completed_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    // Usuario
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Curso
    
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    
    // Inscripción

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
