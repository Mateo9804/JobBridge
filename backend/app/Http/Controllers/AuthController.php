<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Log::info('Registro iniciado', $request->all());
        
        try {
            $validationRules = [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:4',
                'role' => 'required|in:user,company',
            ];

            // Si el rol es company, agregar validación para company_name
            if ($request->role === 'company') {
                $validationRules['company_name'] = 'required|string|max:255';
            }

            $request->validate($validationRules);

            \Log::info('Validación pasada');

            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ];

            // Agregar company_name si el rol es company
            if ($request->role === 'company') {
                $userData['company_name'] = $request->company_name;
            }

            $user = User::create($userData);

            \Log::info('Usuario creado', ['user_id' => $user->id]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 201);
            
        } catch (ValidationException $e) {
            \Log::warning('Error de validación en registro', ['errors' => $e->errors()]);
            
            // Verificar si el error es específicamente por email duplicado
            if (isset($e->errors()['email']) && in_array('The email has already been taken.', $e->errors()['email'])) {
                return response()->json([
                    'message' => 'Ya existe una cuenta con este email. ¿Ya tienes una cuenta?',
                    'error_type' => 'email_exists'
                ], 422);
            }
            
            // Para otros errores de validación
            return response()->json([
                'message' => 'Datos de registro inválidos',
                'errors' => $e->errors()
            ], 422);
            
        } catch (QueryException $e) {
            \Log::error('Error de base de datos en registro', ['error' => $e->getMessage()]);
            
            // Verificar si es un error de clave duplicada (email)
            if ($e->getCode() == 23000 && strpos($e->getMessage(), 'users_email_unique') !== false) {
                return response()->json([
                    'message' => 'Ya existe una cuenta con este email. ¿Ya tienes una cuenta?',
                    'error_type' => 'email_exists'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Error en la base de datos. Inténtalo de nuevo.'
            ], 500);
            
        } catch (\Exception $e) {
            \Log::error('Error inesperado en registro', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error al crear usuario. Inténtalo de nuevo.'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Obtener el perfil del usuario autenticado
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        return response()->json($user);
    }

    /**
     * Actualizar el perfil del usuario autenticado
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->only(['name', 'description']);

        // Actualizar nombre y descripción
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['description'])) {
            $user->description = $data['description'];
        }

        // Subir foto de perfil si viene
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = 'user_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profile_pictures', $filename, 'public');
            $user->profile_picture = $path;
        }

        // Subir CV si viene
        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $path = $file->store('cvs', 'public');
            $user->cv = $path;
        }

        $user->save();
        
        \Log::info('Usuario actualizado', ['user' => $user]);
        return response()->json($user);
    }
}
