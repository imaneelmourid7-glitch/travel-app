<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Voyage extends Model
{
    protected $fillable = [
        'user_id',
        'destination',
        'date_depart',
        'date_retour',
        'description',
        'nb_voyageurs',
        'budget_total'
    ];

    protected $casts = [
        'date_depart' => 'date',
        'date_retour' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function itineraires(): HasMany
    {
        return $this->hasMany(Itineraire::class);
    }

    public function depenses(): HasMany
    {
        return $this->hasMany(Depense::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
