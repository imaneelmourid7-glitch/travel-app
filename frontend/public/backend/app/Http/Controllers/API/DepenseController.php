<?php

namespace App\Http\Controllers\API;

use App\Models\Depense;
use App\Models\Voyage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DepenseController extends Controller
{
    // Liste des dépenses d'un voyage
    public function index($voyage_id)
    {
        $voyage = Voyage::where('user_id', auth()->id())->findOrFail($voyage_id);
        $depenses = $voyage->depenses()->with('categorie')->orderBy('date', 'desc')->get();
        
        return response()->json($depenses);
    }

    // Ajouter une dépense
    public function store(Request $request, $voyage_id)
    {
        $voyage = Voyage::where('user_id', auth()->id())->findOrFail($voyage_id);

        $request->validate([
            'categorie_id' => 'required|exists:categories,id',
            'titre' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string'
        ]);

        $depense = $voyage->depenses()->create($request->all());

        return response()->json($depense, 201);
    }

    // Afficher une dépense spécifique
    public function show($voyage_id, $id)
    {
        $voyage = Voyage::where('user_id', auth()->id())->findOrFail($voyage_id);
        $depense = $voyage->depenses()->with('categorie')->findOrFail($id);
        
        return response()->json($depense);
    }

    // Modifier une dépense
    public function update(Request $request, $voyage_id, $id)
    {
        $voyage = Voyage::where('user_id', auth()->id())->findOrFail($voyage_id);
        $depense = $voyage->depenses()->findOrFail($id);

        $request->validate([
            'categorie_id' => 'exists:categories,id',
            'titre' => 'string|max:255',
            'montant' => 'numeric|min:0',
            'date' => 'date',
            'description' => 'nullable|string'
        ]);

        $depense->update($request->all());

        return response()->json($depense);
    }

    // Supprimer une dépense
    public function destroy($voyage_id, $id)
    {
        $voyage = Voyage::where('user_id', auth()->id())->findOrFail($voyage_id);
        $depense = $voyage->depenses()->findOrFail($id);
        $depense->delete();

        return response()->json(['message' => 'Dépense supprimée avec succès']);
    }

    // Résumé des dépenses par catégorie
    public function resume($voyage_id)
    {
        $voyage = Voyage::where('user_id', auth()->id())->findOrFail($voyage_id);
        
        $depensesParCategorie = $voyage->depenses()
            ->select('categorie_id', \DB::raw('SUM(montant) as total'))
            ->groupBy('categorie_id')
            ->with('categorie')
            ->get();

        $totalDepenses = $voyage->depenses()->sum('montant');
        $budgetRestant = $voyage->budget_total - $totalDepenses;

        return response()->json([
            'total_depenses' => $totalDepenses,
            'budget_total' => $voyage->budget_total,
            'budget_restant' => $budgetRestant,
            'depenses_par_categorie' => $depensesParCategorie
        ]);
    }
}