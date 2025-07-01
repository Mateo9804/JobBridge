<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_id' => 'required|exists:jobs,id',
            'cover_letter' => 'required|string',
            'resume' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $application = Application::create([
            'job_id' => $request->job_id,
            'user_id' => auth()->id(),
            'cover_letter' => $request->cover_letter,
            'resume' => $request->resume,
            'phone' => $request->phone,
            'email' => $request->email,
            'status' => 'pending',
        ]);

        return response()->json($application, 201);
    }

    /**
     * Get applications for a specific user
     */
    public function userApplications()
    {
        $applications = Application::where('user_id', auth()->id())
            ->with('job')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    /**
     * Get applications for a specific job (for companies)
     */
    public function jobApplications($jobId)
    {
        $job = \App\Models\Job::findOrFail($jobId);
        
        // Verificar que el usuario autenticado es el dueño del trabajo
        if ($job->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $applications = Application::where('job_id', $jobId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }
} 