<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()->orders()->with('products')->latest()->get()->toArray();

        return inertia('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function cancel(Order $order)
    {
        if (auth()->id() !== $order->user_id || $order->status !== 'pending') {
            return redirect()->back()->withErrors(['message' => 'No puedes cancelar esta orden.']);
        }

        $order->status = 'cancelled';
        $order->save();

        // Si quieres, puedes notificar al usuario por email aquí

        return redirect()->back()->with('success', 'La orden ha sido cancelada correctamente.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
