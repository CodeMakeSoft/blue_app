<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReturnRequest;

class ReturnController extends Controller
{
    public function showForm(Request $request)
    {
        return view('returns.form', [
            'order' => $request->order,
        ]);
    }

    public function submitForm(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string|max:255',
            'reason' => 'required|string|max:1000',
        ]);

        ReturnRequest::create([
            'order_number' => $request->order_number,
            'reason' => $request->reason,
        ]);

        return redirect()->back()->with('success', '¡La solicitud de devolución ha sido enviada!');
    }
}
