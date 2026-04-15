<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Voyage;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request, Voyage $voyage)
    {
        // Ensure user owns the voyage
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($voyage->activities()->orderBy('date')->orderBy('heure')->get());
    }

    public function store(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'heure' => 'nullable|date_format:H:i',
            'lieu' => 'nullable|string|max:255',
        ]);

        $activity = $voyage->activities()->create($validated);

        return response()->json($activity, 201);
    }

    public function destroy(Request $request, Voyage $voyage, Activity $activity)
    {
        if ($request->user()->id !== $voyage->user_id || $activity->voyage_id !== $voyage->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $activity->delete();

        return response()->json(null, 204);
    }
}
