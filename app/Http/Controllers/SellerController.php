<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use App\Notifications\SellerRegistered;

class SellerController extends Controller
{
    public function create()
    {
        return inertia('Seller/SellerForm', [
            'user' => Auth::user()
        ]);
    }

    public function store(Request $request)
{
    // Validación
    $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,'.$request->user()->id,
        'birth_day' => 'required|integer|between:1,31',
        'birth_month' => 'required|integer|between:1,12',
        'birth_year' => 'required|integer|min:1900',
    ]);

    // Crear objeto Carbon para la fecha de nacimiento
    $birthDate = \Carbon\Carbon::create(
        $validated['birth_year'],
        $validated['birth_month'],
        $validated['birth_day']
    );

    // Verificar edad (16+ años) usando Carbon
    if ($birthDate->age < 16) {
        return back()->withErrors([
            'birth_day' => 'Debes tener al menos 16 años para registrarte como vendedor.'
        ]);
    }

    // Actualizar usuario existente
    $user = $request->user();
    $user->update([
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'],
        'birthdate' => $birthDate->format('Y-m-d'),
    ]);

    // Asignar rol de vendedor
    $sellerRole = Role::firstOrCreate(['name' => 'Seller']);
    $user->assignRole($sellerRole);


    return redirect()->route('dashboard')
        ->with('success', '¡Registro como vendedor completado con éxito!');
}
}