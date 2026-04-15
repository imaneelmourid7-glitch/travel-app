<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Voyage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'destination',
        'description',
        'date_depart',
        'date_retour',
        'nb_voyageurs',
        'budget_total',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function depenses()
    {
        return $this->hasMany(Depense::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
