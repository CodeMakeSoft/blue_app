<?php

namespace App\Http\Controllers;

use id;
use App\Models\City;
use Inertia\Inertia;
use App\Models\State;
use App\Models\Country;
use App\Models\District;
use App\Models\Location;
use App\Models\Municipality;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Address/Index', [
            'locations' => Location::with([
                'country',
                'state',
                'municipality',
                'city',
                'district' => function($query) {
                $query->with(['city.municipality.state']);
            }
            ])
            ->where('user_id')
            ->get(),
            'countries' => Country::all(),
            'districts' => District::with([
                'city' => function($query) {
                    $query->with(['municipality.state']);
                }
            ])->get()
            ]);
    }

    public function create()
    {
        return Inertia::render('Address/Create', [
            'countries' => Country::all(),
            'states' => State::all(),
            'municipalities' => Municipality::all(),
            'cities' => City::all(),
            'districts' => District::with([
                'city' => function($query) {
                    $query->with(['municipality.state']);
                }
            ])->get()
        ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'country_name' => 'required|string|max:255', // Ahora validas el nombre del país
        'alias' => 'required|string|max:255',
        'street' => 'required|string|max:255',
        'ext_number' => 'required|string|max:50',
        'int_number' => 'nullable|string|max:50',
        'postal_code' => 'required|string|max:20',
        'state' => 'required|string|max:255',
        'municipality' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'district' => 'required|string|max:255',
        'district_id' => 'required|exists:districts,id', 
        'phone' => 'nullable|string|max:20',
        'delivery_instructions' => 'nullable|string',
    ]);

    $data = $request->only([
        'country_name', 'alias', 'street', 'ext_number', 'int_number', 
        'postal_code', 'state', 'municipality', 'city', 'district', 
        'phone', 'delivery_instructions'
    ]);

    Location::create($data);

    return redirect()->route('address.index')->with('success', 'Dirección creada exitosamente');
}

    public function update(Request $request, Location $location)
{
    $validated = $request->validate([
        'country_name' => 'required|string|max:255', // Ahora validas el nombre del país
        'alias' => 'required|string|max:255',
        'street' => 'required|string|max:255',
        'ext_number' => 'required|string|max:50',
        'int_number' => 'nullable|string|max:50',
        'postal_code' => 'required|string|max:20',
        'state' => 'required|string|max:255',
        'municipality' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'district' => 'required|string|max:255',
        'district_id' => 'required|exists:districts,id', 
        'phone' => 'nullable|string|max:20',
        'delivery_instructions' => 'nullable|string',
    ]);

    $location->update($validated);

    return redirect()->route('address.index')->with('success', 'Dirección actualizada exitosamente');
}

    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->route('address.index')->with('success', 'Dirección eliminada exitosamente');
    }
}