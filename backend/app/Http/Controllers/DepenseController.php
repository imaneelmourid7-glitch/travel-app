<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use App\Models\Voyage;
use Illuminate\Http\Request;

class DepenseController extends Controller
{
    public function index(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($voyage->depenses()->orderBy('date')->get());
    }

    public function store(Request $request, Voyage $voyage)
    {
        if ($request->user()->id !== $voyage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'titre'     => 'required|string|max:255',
            'montant'   => 'required|numeric|min:0',
            'categorie' => 'required|in:transport,hébergement,nourriture,activités,autre',
            'date'      => 'required|date',
            'note'      => 'nullable|string',
        ]);

        $depense = $voyage->depenses()->create($validated);
        return response()->json($depense, 201);
    }

    public function destroy(Request $request, Voyage $voyage, Depense $depense)
    {
        if ($request->user()->id !== $voyage->user_id || $depense->voyage_id !== $voyage->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $depense->delete();
        return response()->json(null, 204);
    }
}
