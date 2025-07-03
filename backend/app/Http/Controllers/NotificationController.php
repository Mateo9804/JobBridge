<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // Obtener todas las notificaciones del usuario autenticado
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = Notification::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        return response()->json($notifications);
    }

    // Crear una nueva notificación para el usuario autenticado
    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'message' => 'required|string',
            'type' => 'nullable|string',
        ]);
        $notification = Notification::create([
            'user_id' => $user->id,
            'message' => $data['message'],
            'type' => $data['type'] ?? null,
            'read' => false,
        ]);
        return response()->json($notification, 201);
    }

    // Marcar una notificación como leída
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        $notification = Notification::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $notification->read = true;
        $notification->save();
        return response()->json($notification);
    }

    // Marcar todas como leídas
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        Notification::where('user_id', $user->id)->update(['read' => true]);
        return response()->json(['message' => 'Todas las notificaciones marcadas como leídas']);
    }

    // Eliminar una notificación
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $notification = Notification::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $notification->delete();
        return response()->json(['message' => 'Notificación eliminada']);
    }
}
