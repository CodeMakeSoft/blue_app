<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GoogleApiController extends Controller
{
    public function getApiKey()
    {
        return response()->json([
            'key' => env('GOOGLE_MAPS_API_KEY')
        ]);
    }
}
