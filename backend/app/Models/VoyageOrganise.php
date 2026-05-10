<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoyageOrganise extends Model
{
     use HasFactory;

    protected $fillable = [
        'destination',
        'title',
        'duree',
        'date',
        'personnes',
        'prix',
        'image',
    ];
}
