<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Country;
use App\Models\State;
use App\Models\Municipality;
use App\Models\City;
use App\Models\District;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Address/Index', [
            'countries' => Country::all(),
            'states' => State::all(),
            'municipalities' => Municipality::all(),
            'cities' => City::all(),
            'districts' => District::all()
        ]);
    }
    
    public function create()
    {
        $countries = Country::all();
        $states = State::all();
        $municipalities = Municipality::all();
        $cities = City::all();
        $districts = District::all();

        return view('location.create', compact('countries', 'states', 'municipalities', 'cities', 'districts'));
    }
}
