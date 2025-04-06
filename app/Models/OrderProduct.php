<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderProduct extends Pivot
{
    protected $table = 'order_product';

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price'
    ];

    // Si necesitas convertir algún atributo
    protected $casts = [
        'price' => 'decimal:2',
    ];
}