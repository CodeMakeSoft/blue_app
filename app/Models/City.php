<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\DiscoverEvents;

class City extends Model
{
    public function districts()
    {
        return $this->hasMany(District::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
