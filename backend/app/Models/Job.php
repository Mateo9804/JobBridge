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
        'vacancies',
        'status',
    ];

    protected $casts = [
        'salary_min' => 'integer',
        'salary_max' => 'integer',
        'vacancies' => 'integer',
        'skills' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getSalaryRangeAttribute()
    {
        return "€" . number_format($this->salary_min, 0, ',', '.') . " - €" . number_format($this->salary_max, 0, ',', '.');
    }

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

    public function applications()
    {
        return $this->hasMany(\App\Models\Application::class);
    }

    public function favorites()
    {
        return $this->hasMany(\App\Models\JobFavorite::class);
    }
} 