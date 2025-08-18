<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = [
        'name', 
        'municipality_id', 
    ];

    public function municipality() {
        return $this->belongsTo(Municipality::class);
    }

    public function districts() {
        return $this->hasMany(District::class);
    }

    public function getCountryName()
    {
        return optional($this->municipality)->getCountryName();
    }

    public function getStateName()
    {
        return optional($this->municipality)->getStateName();
    }

    public function getMunicipalityName()
    {
        return optional($this->municipality)->name;
    }
}
