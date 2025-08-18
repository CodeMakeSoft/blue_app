<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = [
        'postal_code',
        'neighbourhood', 
        'city_id',
    ];
    public function city() {
        return $this->belongsTo(City::class);
    }

    public function shippingAddresses() {
        return $this->hasMany(ShippingAddress::class);
    }

    public function getCountryName()
    {
        return optional($this->city)->getCountryName();
    }

    public function getStateName()
    {
        return optional($this->city)->getStateName();
    }

    public function getMunicipalityName()
    {
        return optional($this->city)->getMunicipalityName();
    }

    public function getCityName()
    {
        return optional($this->city)->name;
    }
}
