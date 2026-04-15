<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Voyage;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($voyage->reservations()->orderBy('date')->get());
    }

    public function store(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type'      => 'required|in:vol,train,bus,hébergement,autre',
            'titre'     => 'required|string|max:255',
            'date'      => 'required|date',
            'prix'      => 'required|numeric|min:0',
            'reference' => 'nullable|string',
            'adresse'   => 'nullable|string',
            'note'      => 'nullable|string',
        ]);

        $reservation = $voyage->reservations()->create($validated);
        return response()->json($reservation, 201);
    }

    public function destroy(Request $request, Voyage $voyage, Reservation $reservation)
    {
        if ($request->user()->id !== $voyage->user_id || $reservation->voyage_id !== $voyage->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $reservation->delete();
        return response()->json(null, 204);
    }
}
