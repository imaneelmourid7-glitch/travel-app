<?php

namespace App\Http\Controllers\API;

use App\Models\Voyage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class VoyageController extends Controller
{
    // Liste des voyages de l'utilisateur connecté
    public function index()
    {
        $voyages = auth()->user()->voyages()->orderBy('date_depart', 'desc')->get();
        return response()->json($voyages);
    }

    // Créer un voyage
    public function store(Request $request)
    {
        $request->validate([
            'destination' => 'required|string|max:255',
            'date_depart' => 'required|date',
            'date_retour' => 'required|date|after_or_equal:date_depart',
            'description' => 'nullable|string',
            'nb_voyageurs' => 'integer|min:1',
            'budget_total' => 'nullable|numeric|min:0'
        ]);

        $voyage = auth()->user()->voyages()->create($request->all());

        return response()->json($voyage, 201);
    }

    // Afficher un voyage spécifique
    public function show($id)
    {
        $voyage = auth()->user()->voyages()->with(['depenses.categorie', 'itineraires.activites'])->findOrFail($id);
        return response()->json($voyage);
    }

    // Mettre à jour un voyage
    public function update(Request $request, $id)
    {
        $voyage = auth()->user()->voyages()->findOrFail($id);

        $request->validate([
            'destination' => 'sometimes|string|max:255',
            'date_depart' => 'sometimes|date',
            'date_retour' => 'sometimes|date|after_or_equal:date_depart',
            'description' => 'nullable|string',
            'nb_voyageurs' => 'integer|min:1',
            'budget_total' => 'nullable|numeric|min:0'
        ]);

        $voyage->update($request->all());

        return response()->json($voyage);
    }

    // Supprimer un voyage
    public function destroy($id)
    {
        $voyage = auth()->user()->voyages()->findOrFail($id);
        $voyage->delete();

        return response()->json(['message' => 'Voyage supprimé avec succès']);
    }

    // Calculer le budget restant
    public function budgetRestant($id)
    {
        $voyage = auth()->user()->voyages()->findOrFail($id);
        
        $totalDepenses = $voyage->depenses()->sum('montant');
        $budgetRestant = $voyage->budget_total - $totalDepenses;

        return response()->json([
            'budget_total' => $voyage->budget_total,
            'total_depenses' => $totalDepenses,
            'budget_restant' => $budgetRestant
        ]);
    }
}
