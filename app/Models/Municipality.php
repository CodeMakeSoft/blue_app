<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    protected $fillable = [
        'name', 
        'state_id', 
    ];

    public function state() {
        return $this->belongsTo(State::class);
    }

    public function cities() {
        return $this->hasMany(City::class);
    }

    public function getCountryName()
    {
        return optional($this->state)->getCountryName();
    }

    public function getStateName()
    {
        return optional($this->state)->name;
    }
}
