<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\State;
use App\Models\Country;
use App\Models\District;
use App\Models\Municipality;
use Illuminate\Http\Request;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ShippingAddressController extends Controller
{
    public function index()
    {
        $locations = ShippingAddress::withFullLocation()
            ->where('user_id', Auth::id())
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Address/Index', [
            'locations' => $locations->map(function ($location) {
                $locationInfo = $location->getFullLocationInfo();
                
                return [
                    'id' => $location->id,
                    'alias' => $location->alias,
                    'street' => $location->street,
                    'ext_number' => $location->ext_number,
                    'int_number' => $location->int_number,
                    'phone' => $location->phone,
                    'references' => $location->references,
                    'is_default' => $location->is_default,
                    'created_at' => $location->created_at->format('d/m/Y'),
                    'location' => $locationInfo,
                ];
            })
        ]);
    }

    public function create()
    {
        return inertia('Address/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'alias' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'ext_number' => 'required|string|max:20',
            'int_number' => 'nullable|string|max:20',
            'phone' => 'required|string|max:20',
            'references' => 'nullable|string',
            'is_default' => 'sometimes|boolean',
            'country_code' => 'required|string|max:2',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'state' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'neighbourhood' => 'required|string|max:255',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        DB::transaction(function () use ($validated) {
            $country = Country::firstOrCreate(
                ['code' => $validated['country_code']],
                [
                    'name' => $validated['country'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            $state = State::firstOrCreate(
                [
                    'country_id' => $country->id,
                    'name' => $validated['state']
                ],
                ['created_at' => now(), 'updated_at' => now()]
            );

            $municipality = Municipality::firstOrCreate(
                [
                    'state_id' => $state->id,
                    'name' => $validated['municipality']
                ],
                ['created_at' => now(), 'updated_at' => now()]
            );

            $city = City::firstOrCreate(
                [
                    'municipality_id' => $municipality->id, 
                    'name' => $validated['city'] ?? $validated['municipality']
                ],
                ['created_at' => now(), 'updated_at' => now()]
            );

            $district = District::firstOrCreate(
                [
                    'city_id' => $city->id,
                    'postal_code' => $validated['postal_code'],
                    'neighbourhood' => $validated['neighbourhood']

                ],
                [
                    'lat' => $validated['lat'],
                    'lng' => $validated['lng'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            $address = ShippingAddress::create([
                'user_id' => Auth::id(),
                'district_id' => $district->id,
                'alias' => $validated['alias'],
                'street' => $validated['street'],
                'ext_number' => $validated['ext_number'],
                'int_number' => $validated['int_number'] ?? null,
                'phone' => $validated['phone'],
                'references' => $validated['references'] ?? null,
                'is_default' => $validated['is_default'] ?? false,
            ]);

            if ($address->is_default) {
                ShippingAddress::where('user_id', Auth::id())
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }
        });

        return redirect()->route('address.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Dirección guardada correctamente'
            ]);
    }

    public function edit($id)
    {
        $address = ShippingAddress::withFullLocation()
            ->where('user_id', Auth::id())
            ->findOrFail($id);
        
        return inertia('Address/Edit', [
            'address' => [
                'id' => $address->id,
                'alias' => $address->alias,
                'street' => $address->street,
                'ext_number' => $address->ext_number,
                'int_number' => $address->int_number,
                'phone' => $address->phone,
                'references' => $address->references,
                'is_default' => $address->is_default,
                'location' => $address->getFullLocationInfo(),
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'alias' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'ext_number' => 'required|string|max:20',
            'int_number' => 'nullable|string|max:20',
            'phone' => 'required|string|max:20',
            'references' => 'nullable|string',
            'is_default' => 'sometimes|boolean',
            // Campos geográficos
            'country_code' => 'required|string|max:2',
            'country' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'state' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'neighbourhood' => 'required|string|max:255',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $address = ShippingAddress::where('user_id', Auth::id())->findOrFail($id);

        DB::transaction(function () use ($validated, $address) {
            $country = Country::firstOrCreate(
                ['code' => $validated['country_code']],
                [
                    'name' => $validated['country'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            $state = State::firstOrCreate(
                [
                    'country_id' => $country->id,
                    'name' => $validated['state']
                ],
                ['created_at' => now(), 'updated_at' => now()]
            );

            $municipality = Municipality::firstOrCreate(
                [
                    'state_id' => $state->id,
                    'name' => $validated['municipality']
                ],
                ['created_at' => now(), 'updated_at' => now()]
            );

            $city = City::firstOrCreate(
                [
                    'municipality_id' => $municipality->id, 
                    'name' => $validated['city'] ?? $validated['municipality']
                ],
                ['created_at' => now(), 'updated_at' => now()]
            );

            $district = District::firstOrCreate(
                [
                    'city_id' => $city->id,
                    'postal_code' => $validated['postal_code'],
                    'neighbourhood' => $validated['neighbourhood']

                ],
                [
                    'lat' => $validated['lat'],
                    'lng' => $validated['lng'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            $isMakingDefault = ($validated['is_default'] ?? false) && !$address->is_default;
            
            $address->update([
                'district_id' => $district->id,
                'alias' => $validated['alias'],
                'street' => $validated['street'],
                'ext_number' => $validated['ext_number'],
                'int_number' => $validated['int_number'] ?? null,
                'phone' => $validated['phone'],
                'references' => $validated['references'] ?? null,
                'is_default' => $validated['is_default'] ?? $address->is_default,
            ]);

            if ($isMakingDefault) {
                ShippingAddress::where('user_id', Auth::id())
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }
        });

        return redirect()->route('address.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Dirección actualizada correctamente'
            ]);
    }

    public function destroy($id)
    {
        $address = ShippingAddress::where('user_id', Auth::id())->findOrFail($id);
        
        DB::transaction(function () use ($address) {
            $wasDefault = $address->is_default;
            $address->delete();

            if ($wasDefault) {
                ShippingAddress::where('user_id', Auth::id())
                    ->latest()
                    ->first()
                    ?->update(['is_default' => true]);
            }
        });

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Dirección eliminada correctamente'
        ]);
    }

    public function setDefault($id)
    {
        $address = ShippingAddress::where('user_id', Auth::id())->findOrFail($id);
        
        DB::transaction(function () use ($address) {
            ShippingAddress::where('user_id', Auth::id())
                ->update(['is_default' => false]);
                
            $address->update(['is_default' => true]);
        });

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Dirección predeterminada actualizada'
        ]);
    }
}