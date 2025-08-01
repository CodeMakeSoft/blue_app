<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShippingAddress extends Model
{
    use SoftDeletes; 

    protected $fillable = [
        'alias', 'street', 'ext_number', 'int_number',
        'phone', 'references', 'is_default',
        'district_id', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function district()
    {
        return $this->belongsTo(District::class)->withDefault();
    }

     public function scopeWithFullLocation($query)
    {
        return $query->with([
            'district' => function($q) {
                $q->with([
                    'city' => function($q) {
                        $q->with([
                            'municipality' => function($q) {
                                $q->with('state.country');
                            }
                        ]);
                    }
                ]);
            }
        ]);
    }

    public function getCountryName()
    {
        return optional($this->district)->getCountryName();
    }

    public function getStateName()
    {
        return optional($this->district)->getStateName();
    }

    public function getMunicipalityName()
    {
        return optional($this->district)->getMunicipalityName();
    }

    public function getCityName()
    {
        return optional($this->district)->getCityName();
    }

    public function getNeighbourhoodName()
    {
        return optional($this->district)->name;
    }

    public function getFullLocationInfo()
    {
        return [
            'country' => $this->getCountryName(),
            'state' => $this->getStateName(),
            'municipality' => $this->getMunicipalityName(),
            'city' => $this->getCityName(),
            'neighbourhood' => $this->getNeighbourhoodName(),
            'postal_code' => optional($this->district)->postal_code,
        ];
    }

}
