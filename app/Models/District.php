<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
