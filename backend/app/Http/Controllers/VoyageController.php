<?php

namespace App\Http\Controllers;

use App\Models\Voyage;
use Illuminate\Http\Request;

class VoyageController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->voyages()->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'destination' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_depart' => 'required|date',
            'date_retour' => 'required|date|after_or_equal:date_depart',
            'nb_voyageurs' => 'required|integer|min:1',
            'budget_total' => 'required|numeric|min:0',
        ]);

        $voyage = $request->user()->voyages()->create($validated);

        return response()->json($voyage, 201);
    }

    public function show(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($voyage);
    }

    public function update(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'destination' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'date_depart' => 'sometimes|date',
            'date_retour' => 'sometimes|date|after_or_equal:date_depart',
            'nb_voyageurs' => 'sometimes|integer|min:1',
            'budget_total' => 'sometimes|numeric|min:0',
        ]);

        $voyage->update($validated);

        return response()->json($voyage);
    }

    public function destroy(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $voyage->delete();

        return response()->json(null, 204);
    }
}
