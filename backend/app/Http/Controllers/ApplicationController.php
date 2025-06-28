<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Support\Facades\Validator;

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
} 