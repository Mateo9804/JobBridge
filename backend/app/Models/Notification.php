<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'message',
        'read',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function createForUser($userId, $type, $message)
    {
        return self::create([
            'user_id' => $userId,
            'type' => $type,
            'message' => $message,
            'read' => false,
        ]);
    }
}
