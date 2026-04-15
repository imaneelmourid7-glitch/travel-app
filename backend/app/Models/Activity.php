<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'voyage_id',
        'titre',
        'description',
        'date',
        'heure',
        'lieu'
    ];

    public function voyage()
    {
        return $this->belongsTo(Voyage::class);
    }
}
