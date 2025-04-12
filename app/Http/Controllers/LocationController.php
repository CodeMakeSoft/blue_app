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
use Illuminate\Support\Facades\Auth;


class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Address/Index', [
            'locations' => Location::with(['district.city.municipality.state.country'])
                ->where('user_id', Auth::id()) 
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
        $request->validate([
            'alias' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'ext_number' => 'required|string|max:50',
            'int_number' => 'nullable|string|max:50',
            'district_id' => 'required|exists:districts,id',
            'phone' => 'required|string|max:20',
            'delivery_instructions' => 'nullable|string',
        ]);

        $data = $request->only([
            'country_name', 'alias', 'street', 'ext_number', 'int_number', 
            'postal_code', 'state', 'municipality', 'city', 'district_id',
            'user_id','phone', 'delivery_instructions'
        ]);
        
        $data['user_id'] = Auth::id();

        Location::create($data);

        return redirect()->route('address.index')->with('success', 'Dirección creada exitosamente');
    }

    public function edit(Location $address)
    {
        return Inertia::render('Address/Edit', [
            'location' => $address,
            'countries' => Country::all(),
            'districts' => District::with(['city.municipality.state.country'])->get()
        ]);
    }

    public function update(Request $request, Location $address)
    {
        $validated = $request->validate([
            'alias' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'ext_number' => 'required|string|max:50',
            'int_number' => 'nullable|string|max:50',
            'district_id' => 'required|exists:districts,id',
            'phone' => 'required|string|max:20',
            'delivery_instructions' => 'nullable|string',
        ]);

        $address->update($validated);

        return redirect()->route('address.index')->with('success', 'Dirección actualizada exitosamente');
    }

    public function destroy(Location $address)
    {
        $address->delete();
        return redirect()->route('address.index')
            ->with('success', 'Address eliminado correctamente');
    }

}

