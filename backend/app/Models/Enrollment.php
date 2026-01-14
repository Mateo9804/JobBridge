<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'status',
        'progress_percentage',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Usuario inscrito 
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Curso relacionado
    
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // Progreso del curso
    
    public function progress()
    {
        return $this->hasMany(CourseProgress::class);
    }

    
    // Calcular progreso basado en lecciones completadas
    
    public function calculateProgress()
    {
        $course = $this->course;

        $plannedLessonIds = [];
        if (is_array($course->lessons)) {
            $count = count($course->lessons);
            $plannedLessonIds = [];
            for ($i = 1; $i <= $count; $i++) {
                $plannedLessonIds[] = 'lesson-' . $i;
            }
        }

        if (stripos((string) $course->title, 'c++') !== false) {
            $plannedLessonIds = [
                'leccion-1-1','leccion-1-2','leccion-1-3',
                'leccion-2-1','leccion-2-2','leccion-2-3',
                'leccion-3-1','leccion-3-2','leccion-3-3',
                'leccion-4-1','leccion-4-2','leccion-4-3',
            ];
        }

        $titleLower = strtolower((string) $course->title);
        if (strpos($titleLower, 'c#') !== false || strpos($titleLower, 'csharp') !== false) {
            $plannedLessonIds = [
                'csharp-1-1','csharp-1-2',
                'csharp-2-1','csharp-2-2',
                'csharp-3-1','csharp-3-2',
                'csharp-4-1','csharp-4-2',
                'csharp-5-1','csharp-5-2',
                'csharp-6-1','csharp-6-2',
                'csharp-7-1','csharp-7-2',
                'csharp-8-1','csharp-8-2',
            ];
        }

        if (strpos($titleLower, 'programación en c') !== false) {
            $plannedLessonIds = [
                'c-1-1','c-1-2',
                'c-2-1','c-2-2',
                'c-3-1','c-3-2',
                'c-4-1','c-4-2',
                'c-5-1','c-5-2',
                'c-6-1','c-6-2',
                'c-7-1','c-7-2',
                'c-8-1','c-8-2',
            ];
        }

        // JavaScript desde Cero
        if (strpos($titleLower, 'javascript') !== false) {
            $plannedLessonIds = [
                'js-1-1','js-1-2','js-1-3',
                'js-2-1','js-2-2',
                'js-3-1','js-3-2',
            ];
        }

        // Python para Principiantes
        if (strpos($titleLower, 'python') !== false) {
            $plannedLessonIds = [
                'python-1-1','python-1-2','python-1-3',
                'python-2-1','python-2-2',
                'python-3-1',
            ];
        }

        // HTML y CSS Fundamentos
        if ((strpos($titleLower, 'html') !== false && strpos($titleLower, 'css') !== false) || strpos($titleLower, 'html y css') !== false) {
            $plannedLessonIds = [
                'htmlcss-1-1','htmlcss-1-2',
                'htmlcss-2-1','htmlcss-2-2',
            ];
        }

        // Node.js y Express: Backend Profesional
        if (strpos($titleLower, 'node.js') !== false || strpos($titleLower, 'nodejs') !== false || strpos($titleLower, 'express') !== false) {
            $plannedLessonIds = [
                'nodejs-1-1','nodejs-1-2',
                'nodejs-2-1','nodejs-2-2',
                'nodejs-3-1','nodejs-3-2',
            ];
        }

        // Spring Boot Avanzado
        if (strpos($titleLower, 'spring boot') !== false) {
            $plannedLessonIds = [
                'spring-1-1','spring-1-2',
                'spring-2-1','spring-2-2',
                'spring-3-1','spring-3-2',
                'spring-4-1',
            ];
        }

        // React Avanzado: Desarrollo Profesional
        if (strpos($titleLower, 'react avanzado') !== false) {
            $plannedLessonIds = [
                'react-1-1','react-1-2',
                'react-2-1','react-2-2',
                'react-3-1','react-4-1',
            ];
        }

        $totalLessons = count($plannedLessonIds);
        if ($totalLessons === 0) {
            return 0;
        }

        $completedLessons = $this->progress()
            ->where('is_completed', true)
            ->whereIn('lesson_id', $plannedLessonIds)
            ->distinct('lesson_id')
            ->count('lesson_id');

        $percentage = ($completedLessons / $totalLessons) * 100;
        
        $this->update([
            'progress_percentage' => min(100, round($percentage)),
            'status' => $percentage >= 100 ? 'completed' : 'in_progress'
        ]);

        if ($percentage >= 100 && !$this->completed_at) {
            $this->update(['completed_at' => now()]);
        }

        return $this->progress_percentage;
    }
}
