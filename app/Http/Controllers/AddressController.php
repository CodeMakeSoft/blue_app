<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Address;

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

        // Get the authenticated user
        $user = Auth::user();
        
        // Add user_id to the validated data
        $validated['user_id'] = $user->id;
        
        // Create the address directly through the Address model
        $address = Address::create($validated);

        return redirect()->route('addresses.index')
            ->with('success', 'Address added successfully!');
    }
}
