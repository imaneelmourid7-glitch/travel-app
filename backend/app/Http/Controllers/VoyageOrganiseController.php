<?php

namespace App\Http\Controllers;

use App\Models\VoyageOrganise;
use Illuminate\Http\Request;

class VoyageOrganiseController extends Controller
{
    public function index()
    {
        return VoyageOrganise::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'destination' => 'required|string',
            'title' => 'required|string',
            'duree' => 'required|string',
            'date' => 'required|string',
            'personnes' => 'required|string',
            'prix' => 'required|string',
            'image' => 'nullable|string',
        ]);

        return VoyageOrganise::create($data);
    }

    public function show(VoyageOrganise $voyages_organise)
    {
        return $voyages_organise;
    }

    public function update(Request $request, VoyageOrganise $voyages_organise)
    {
        $data = $request->validate([
            'destination' => 'required|string',
            'title' => 'required|string',
            'duree' => 'required|string',
            'date' => 'required|string',
            'personnes' => 'required|string',
            'prix' => 'required|string',
            'image' => 'nullable|string',
        ]);

        $voyages_organise->update($data);

        return $voyages_organise;
    }

    public function destroy(VoyageOrganise $voyages_organise)
    {
        $voyages_organise->delete();

        return response()->json(['message' => 'Voyage supprimé']);
    }
}