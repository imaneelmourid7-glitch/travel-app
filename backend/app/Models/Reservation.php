<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = ['voyage_id', 'type', 'titre', 'date', 'prix', 'reference', 'adresse', 'note'];

    public function voyage()
    {
        return $this->belongsTo(Voyage::class);
    }
}
