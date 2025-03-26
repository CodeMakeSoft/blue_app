<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function createSession(Request $request)
    {
        // Configurar la clave secreta de Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        // Obtener el usuario autenticado y su carrito
        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart || $cart->products->isEmpty()) {
            return Inertia::render('Cart/Index');
        }

        // Preparar los productos para Stripe
        $lineItems = $cart->products->map(function ($product) {
            return [
                'price_data' => [
                    'currency' => 'mxn',
                    'product_data' => [
                        'name' => $product->name,
                        'images' => $product->images->pluck('url')->toArray(),
                    ],
                    'unit_amount' => $product->price * 100, // In cents
                ],
                'quantity' => $product->pivot->quantity,
            ];
        })->toArray();

        // Crear la sesión de pago
        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            //'success_url' => route('checkout.success'),
            //'cancel_url' => route('checkout.cancel'),
        ]);

        // Devolver la URL de Stripe al frontend
        return response()->json(['redirectUrl' => $session->url]);
    }

    public function success()
    {
        //return Inertia::render('Checkout/Success');
    }

    public function cancel()
    {
        //return Inertia::render('Checkout/Cancel');
    }
}