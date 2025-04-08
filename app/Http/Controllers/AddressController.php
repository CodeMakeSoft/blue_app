<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Address;



class AddressController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        dd($user->addresses); 

        $addresses = Auth::user()->addresses;
        
        return inertia('Addresses/Index', [
            'addresses' => $addresses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'formatted_address' => 'required|string',
            'is_default' => 'sometimes|boolean'
        ]);

        $user = Auth::user();

        // Si es la primera dirección o se marca como predeterminada
        if ($request->is_default || !$user->addresses()->exists()) {
            // Primero quitamos el predeterminado de otras direcciones
            $user->addresses()->update(['is_default' => false]);
            $validated['is_default'] = true;
        }

        $user->addresses()->create($validated);

        return back()->with('success', 'Dirección guardada correctamente');
    }
}
