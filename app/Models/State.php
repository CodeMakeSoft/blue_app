<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    public function municipalities()
    {
        return $this->hasMany(Municipality::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
