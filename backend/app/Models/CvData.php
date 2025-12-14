<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CvData extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'email',
        'phone',
        'address',
        'birth_date',
        'nationality',
        'professional_summary',
        'work_experience',
        'education',
        'skills',
        'languages',
        'certifications',
        'references',
        'additional_info',
    ];

    protected $casts = [
        'work_experience' => 'array',
        'education' => 'array',
        'skills' => 'array',
        'languages' => 'array',
        'certifications' => 'array',
        'references' => 'array',
        'additional_info' => 'array',
        'birth_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
