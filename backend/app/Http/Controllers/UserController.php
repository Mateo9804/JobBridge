<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Obtener la foto de perfil de cualquier usuario (para empresas premium).
     */
    public function getUserProfilePicture($id)
    {
        try {
            $user = User::findOrFail($id);
            
            if (!$user->profile_picture) {
                abort(404, 'El usuario no tiene foto de perfil');
            }
            
            $filePath = storage_path('app/public/' . $user->profile_picture);
            
            if (!file_exists($filePath)) {
                abort(404, 'El archivo de imagen no existe');
            }
            
            $file = file_get_contents($filePath);
            $type = mime_content_type($filePath) ?: 'image/png';
            
            return response($file, 200)
                ->header('Content-Type', $type)
                ->header('Cache-Control', 'public, max-age=31536000');
        } catch (\Exception $e) {
            Log::error('Error sirviendo foto de perfil de usuario ' . $id . ': ' . $e->getMessage());
            abort(500, 'Error al servir la imagen');
        }
    }

    /**
     * Obtener todos los usuarios registrados que han completado su perfil.
     * Solo para empresas con plan profesional.
     */
    public function getOfficialUsers(Request $request)
    {
        $company = $request->user();

        if ($company->role !== 'company' || $company->plan !== 'professional') {
            return response()->json([
                'message' => 'Solo las empresas con Plan Profesional pueden acceder a esta sección.'
            ], 403);
        }

        // Obtener usuarios (no empresas) que han completado su perfil
        $users = User::where('role', 'user')
            ->where('is_profile_complete', true)
            ->select('id', 'name', 'full_name', 'first_name', 'last_name', 'email', 'phone', 'nationality', 'birthday', 'education_level', 'skills', 'technologies', 'languages', 'experience_years', 'profile_picture')
            ->get();

        // Agregar URLs de imágenes
        $users = $users->map(function($user) {
            $userData = $user->toArray();
            $userData['profile_picture_url'] = $user->profile_picture ? Storage::url($user->profile_picture) : null;
            return $userData;
        });

        return response()->json($users);
    }

    /**
     * Completar el perfil del usuario (onboarding).
     */
    public function completeProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'user') {
            return response()->json(['message' => 'Solo los usuarios pueden completar su perfil profesional.'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'nationality' => 'required|string|max:100',
            'birthday' => 'required|date',
            'education_level' => 'required|string',
            'skills' => 'required|array',
            'technologies' => 'required|array',
            'experience_years' => 'required|string',
        ]);

        $user->first_name = $validated['first_name'];
        $user->last_name = $validated['last_name'];
        $user->full_name = $validated['first_name'] . ' ' . $validated['last_name'];
        $user->phone = $validated['phone'];
        $user->nationality = $validated['nationality'];
        $user->birthday = $validated['birthday'];
        $user->education_level = $validated['education_level'];
        $user->skills = $validated['skills'];
        $user->technologies = $validated['technologies'];
        $user->experience_years = $validated['experience_years'];
        $user->is_profile_complete = true;
        
        $user->save();

        return response()->json([
            'message' => '¡Perfil completado con éxito! Ahora eres un usuario oficial.',
            'user' => $user
        ]);
    }
}
