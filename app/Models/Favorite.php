<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Product;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'product_id'];

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el producto
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
