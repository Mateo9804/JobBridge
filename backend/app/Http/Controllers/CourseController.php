<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Exceptions\CourseNotAvailableException;

class CourseController extends Controller
{
     //Listar todos los cursos activos  
    public function index(Request $request)
    {
        try {
            $query = Course::where('is_active', true);

            if ($request->has('category') && $request->category !== 'todos') {
                $query->where('category', $request->category);
            }

            if ($request->has('level') && $request->level !== 'todos') {
                $query->where('level', $request->level);
            }

            if ($request->has('type') && $request->type !== 'todos') {
                $query->where('type', $request->type);
            }

            $courses = $query->get();
            
            // Asegurar que todos los cursos tengan rating y ratings_count actualizados
            foreach ($courses as $course) {
                // Si el curso tiene reseñas pero el rating no está actualizado, actualizarlo
                $reviewsCount = $course->reviews()->count();
                if ($reviewsCount > 0 && ($course->ratings_count != $reviewsCount || $course->rating == 0)) {
                    $course->updateRating();
                    $course->refresh();
                }
            }

            return response()->json($courses);
        } catch (\Exception $e) {
            Log::error('Error in CourseController@index', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener cursos: ' . $e->getMessage()], 500);
        }
    }

    
    // Obtener un curso específico
     
    public function show(Course $course)
    {
        try {
            return response()->json($course);
        } catch (\Exception $e) {
            Log::error('Error in CourseController@show', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener curso'], 500);
        }
    }

    // Inscribir usuario en un curso
    
    public function enroll(Request $request, Course $course)
    {
        try {
            /** @var \App\Models\User|null $user */
            $user = Auth::user();
            if (!Auth::check() || !$user || $user->role !== 'user') {
                return response()->json(['error' => 'Solo usuarios pueden inscribirse en cursos'], 403);
            }

            $userId = Auth::id();

            $existingEnrollment = Enrollment::where('user_id', $userId)
                ->where('course_id', $course->id)
                ->first();

            if ($existingEnrollment) {
                return response()->json(['error' => 'Ya estás inscrito en este curso'], 400);
            }

            if ($course->type === 'premium') {
                // Verificar si el usuario tiene plan profesional
                if ($user->plan !== 'professional') {
                    return response()->json([
                        'error' => 'Curso premium',
                        'message' => 'Este curso es Premium. Necesitas el Plan Profesional para acceder.',
                        'requires_premium' => true
                    ], 403);
                }
                // Si tiene plan profesional, permitir la inscripción
            }

            // Usar transacción para garantizar integridad de datos
            $enrollment = DB::transaction(function () use ($userId, $course) {
                // Crear inscripción
                $enrollment = Enrollment::create([
                    'user_id' => $userId,
                    'course_id' => $course->id,
                    'status' => 'enrolled',
                    'progress_percentage' => 0,
                    'started_at' => now(),
                ]);

                // Actualizar contador de inscripciones
                $course->increment('enrollments_count');

                Log::info('User enrolled in course', ['user_id' => $userId, 'course_id' => $course->id]);

                return $enrollment;
            });

            return response()->json([
                'message' => 'Inscripción exitosa',
                'enrollment' => $enrollment
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error in CourseController@enroll', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al inscribirse: ' . $e->getMessage()], 500);
        }
    }

    public function myCourses()
    {
        try {
            if (!Auth::check()) {
                return response()->json(['error' => 'No autenticado'], 401);
            }

            $userId = Auth::id();

            $enrollments = Enrollment::with('course')
                ->where('user_id', $userId)
                ->get();

            return response()->json($enrollments);

        } catch (\Exception $e) {
            Log::error('Error in CourseController@myCourses', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener cursos inscritos'], 500);
        }
    }

    public function completeLesson(Request $request, Enrollment $enrollment)
    {
        try {
            if (!Auth::check() || Auth::id() !== $enrollment->user_id) {
                return response()->json(['error' => 'No autorizado'], 403);
            }

            $validator = Validator::make($request->all(), [
                'lesson_id' => 'required|string',
                'time_spent' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $existingProgress = \App\Models\CourseProgress::where('enrollment_id', $enrollment->id)
                ->where('lesson_id', $request->lesson_id)
                ->first();

            if ($existingProgress && $existingProgress->is_completed) {
                return response()->json(['error' => 'Lección ya completada'], 400);
            }

            \App\Models\CourseProgress::updateOrCreate(
                [
                    'enrollment_id' => $enrollment->id,
                    'user_id' => $enrollment->user_id,
                    'course_id' => $enrollment->course_id,
                    'lesson_id' => $request->lesson_id,
                ],
                [
                    'is_completed' => true,
                    'time_spent' => $request->time_spent ?? 0,
                    'completed_at' => now(),
                ]
            );

            $enrollment->calculateProgress();

            return response()->json([
                'message' => 'Lección completada',
                'progress' => $enrollment->progress_percentage
            ]);

        } catch (\Exception $e) {
            Log::error('Error in CourseController@completeLesson', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al completar lección'], 500);
        }
    }

    public function getProgress(Enrollment $enrollment)
    {
        try {
            if (!Auth::check() || Auth::id() !== $enrollment->user_id) {
                return response()->json(['error' => 'No autorizado'], 403);
            }

            $enrollment->calculateProgress();

            return response()->json([
                'enrollment' => $enrollment,
                'progress_details' => $enrollment->progress,
            ]);

        } catch (\Exception $e) {
            Log::error('Error in CourseController@getProgress', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener progreso'], 500);
        }
    }

    public function getReviews(Course $course)
    {
        try {
            $reviews = Review::where('course_id', $course->id)
                ->with('user:id,name,profile_picture')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Error in CourseController@getReviews', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al obtener reseñas'], 500);
        }
    }

    public function addReview(Request $request, Course $course)
    {
        try {
            if (!Auth::check()) {
                return response()->json(['error' => 'No autenticado'], 401);
            }

            $userId = Auth::id();

            // Verificar si está inscrito y completó el curso
            $enrollment = Enrollment::where('user_id', $userId)
                ->where('course_id', $course->id)
                ->first();

            if (!$enrollment || $enrollment->progress_percentage < 100) {
                return response()->json(['error' => 'Debes completar el curso antes de dejar una reseña'], 403);
            }

            $validator = Validator::make($request->all(), [
                'rating' => 'required|numeric|min:0.5|max:5',
                'comment' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $review = Review::updateOrCreate(
                ['course_id' => $course->id, 'user_id' => $userId],
                ['rating' => $request->rating, 'comment' => $request->comment]
            );

            // Actualizar la valoración media del curso
            $course->updateRating();
            
            // Recargar el curso para obtener el rating actualizado
            $course->refresh();

            return response()->json([
                'message' => 'Reseña enviada correctamente',
                'review' => $review,
                'course' => $course // Incluir el curso actualizado con el nuevo rating
            ]);

        } catch (\Exception $e) {
            Log::error('Error in CourseController@addReview', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al enviar reseña'], 500);
        }
    }
}
