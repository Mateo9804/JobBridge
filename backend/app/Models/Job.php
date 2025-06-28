<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'company',
        'location',
        'category',
        'experience',
        'salary_min',
        'salary_max',
        'description',
        'skills',
        'type',
        'user_id',
    ];

    protected $casts = [
        'salary_min' => 'integer',
        'salary_max' => 'integer',
        'skills' => 'array',
    ];

    /**
     * Get the user that owns the job.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the salary range as a formatted string.
     */
    public function getSalaryRangeAttribute()
    {
        return "€" . number_format($this->salary_min, 0, ',', '.') . " - €" . number_format($this->salary_max, 0, ',', '.');
    }

    /**
     * Get skills as array.
     */
    public function getSkillsArrayAttribute()
    {
        if (is_array($this->skills)) {
            return $this->skills;
        }
        
        if (is_string($this->skills)) {
            try {
                return json_decode($this->skills, true) ?: [];
            } catch (\Exception $e) {
                return [$this->skills];
            }
        }
        
        return [];
    }
} 