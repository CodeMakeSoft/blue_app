<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; // Necesario para verificación
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens, SoftDeletes;

    /**
     * Campos que pueden asignarse masivamente.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        // ❌ No incluyas email_verified_at aquí, Laravel lo maneja.
    ];

    /**
     * Campos ocultos en serializaciones.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Conversión de tipos.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    /**
     * Relaciones
     */

    // Relación con direcciones de envío
    public function shippingAddresses()
    {
        return $this->hasMany(ShippingAddress::class);
    }

    // Relación con carrito
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    // Relación con pedidos
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Relación con productos
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    
}
