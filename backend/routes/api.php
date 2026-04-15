<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\VoyageController;
use Illuminate\Http\Request;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/voyages', VoyageController::class);
    Route::apiResource('voyages.activities', App\Http\Controllers\ActivityController::class)->shallow();
    Route::apiResource('voyages.depenses', App\Http\Controllers\DepenseController::class)->shallow();
    Route::apiResource('voyages.reservations', App\Http\Controllers\ReservationController::class)->shallow();

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [App\Http\Controllers\AdminController::class, 'stats']);
        Route::get('/users', [App\Http\Controllers\AdminController::class, 'users']);
        Route::delete('/users/{user}', [App\Http\Controllers\AdminController::class, 'deleteUser']);
    });
});