<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'formatted_address' => 'required|string'
        ]);

        $address = Auth::user()->addresses()->create($validated);

        return redirect()->route('addresses.index')
            ->with('success', 'Address added successfully!');
    }
}
