<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'user_id',
        'cover_letter',
        'resume',
        'phone',
        'email',
        'status',
    ];

    /**
     * Get the job that the application is for.
     */
    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Get the user that submitted the application.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 