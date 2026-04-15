<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorie extends Model
{
    protected $fillable = ['nom', 'type'];

    public function depenses(): HasMany
    {
        return $this->hasMany(Depense::class);
    }
}
