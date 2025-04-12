<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Image extends Model
{
    /** @use HasFactory<\Database\Factories\ImageFactory> */
    use HasFactory;
    protected $fillable = ['url'];
    protected $appends = ['full_url'];

    public function imageable():MorphTo
    {
        return $this->morphTo();
    }

    // Accesor para obtener la URL completa de la imagen
    public function getFullUrlAttribute()
    {
        return asset('storage/' . $this->url);
    }
}
