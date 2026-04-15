<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Voyage;
use App\Models\Depense;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Middleware-like check: only allow admin users.
     */
    private function checkAdmin(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403, 'Accès réservé aux administrateurs');
        }
    }

    public function stats(Request $request)
    {
        $this->checkAdmin($request);

        return response()->json([
            'users'          => User::count(),
            'voyages'        => Voyage::count(),
            'total_depenses' => Depense::sum('montant'),
        ]);
    }

    public function users(Request $request)
    {
        $this->checkAdmin($request);

        $users = User::withCount('voyages')->latest()->get();
        return response()->json($users);
    }

    public function deleteUser(Request $request, User $user)
    {
        $this->checkAdmin($request);

        // Prevent self-deletion
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous supprimer vous-même'], 400);
        }

        $user->delete();
        return response()->json(null, 204);
    }
}
