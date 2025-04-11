<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
    'alias',
    'street',
    'postal_code',
    'state',
    'municipality',
    'city',
    'district',
    'country',
    'phone',
    'int_number',
    'ext_number',
    'delivery_instructions',
    'district_id',
    'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function postalCode()
    {
        return $this->through('district')->has('postal_code');  
    }

    public function city()
    {
        return $this->through('district')->has('city');
    }

    public function municipality()
    {
        return $this->through('district.city')->has('municipality');
    }

    public function state()
    {
        return $this->through('district.city.municipality')->has('state');
    }

    public function country()
    {
        return $this->through('district.city.municipality.state')->has('country');
    }

}
