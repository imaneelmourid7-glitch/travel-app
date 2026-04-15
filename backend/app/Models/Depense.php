<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    use HasFactory;

    protected $fillable = ['voyage_id', 'titre', 'montant', 'categorie', 'date', 'note'];

    public function voyage()
    {
        return $this->belongsTo(Voyage::class);
    }
}
