<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    public function cities()
    {
        return $this->hasMany(City::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }
}
