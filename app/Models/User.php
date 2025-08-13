<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; // Necesario para verificación
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * Campos que pueden asignarse masivamente.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        // ❌ No incluyas email_verified_at aquí,
        // este campo lo maneja Laravel al verificar el correo.
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
     * Relación con direcciones.
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Relación con el carrito.
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    /**
     * Relación con pedidos.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Relación con ubicaciones.
     */
    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
