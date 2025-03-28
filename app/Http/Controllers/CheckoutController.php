<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Inertia\Inertia;
use App\Models\Order;

class CheckoutController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $cart = $user->cart;
    
        if (!$cart || $cart->products->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'El carrito está vacío');
        }
    
        $products = $cart->products()->with('images')->withPivot('quantity')->get();
        
        // Ensure totals are calculated and not null
        $subtotal = $cart->subtotal ?? 0;
        $taxes = $cart->taxes ?? 0;
        $shipping = $cart->shipping_cost ?? 0;
        
        return Inertia::render('Checkout/Index', [
            'cart' => $products,
            'total' => [
                'subtotal' => (float) $subtotal,
                'taxes' => (float) $taxes,
                'shipping' => (float) $shipping,
                'total' => (float) ($subtotal + $taxes + $shipping)
            ],
            'stripeKey' => config('services.stripe.key')
        ]);
    }
    
    public function createSession(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart || $cart->products->isEmpty()) {
            return response()->json([
                'error' => 'El carrito está vacío'
            ], 400);
        }

        $products = $cart->products;

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $products->map(function ($product) {
                    return [
                        'price_data' => [
                            'currency' => 'mxn',
                            'product_data' => [
                                'name' => $product->name,
                                'images' => [$product->images->first()->url],
                            ],
                            'unit_amount' => $product->price * 100, // Stripe usa centavos
                        ],
                        'quantity' => $product->pivot->quantity,
                    ];
                })->toArray(),
                'mode' => 'payment',
                'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('checkout.cancel'),
            ]);

            return response()->json([
                'id' => $session->id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function success(Request $request)
    {
        try {
            if (!$request->has('session_id')) {
                throw new \Exception('No se proporcionó ID de sesión');
            }

            $sessionId = $request->get('session_id');
            Stripe::setApiKey(config('services.stripe.secret'));
            $session = Session::retrieve($sessionId);
            
            if ($session->payment_status !== 'paid') {
                throw new \Exception('El pago no ha sido completado');
            }

            DB::beginTransaction();
            try {
                $user = Auth::user();
                $cart = $user->cart;

                // Crear la orden
                $order = Order::create([
                    'user_id' => $user->id,
                    'status' => 'completed',
                    'payment_id' => $session->payment_intent,
                    'shipping_address' => $session->shipping->address->line1 ?? '',
                    'shipping_city' => $session->shipping->address->city ?? '',
                    'shipping_state' => $session->shipping->address->state ?? '',
                    'shipping_zip' => $session->shipping->address->postal_code ?? '',
                    'total' => $session->amount_total / 100
                ]);

                foreach ($cart->products as $product) {
                    if ($product->stock < $product->pivot->quantity) {
                        throw new \Exception('Stock insuficiente para ' . $product->name);
                    }

                    $order->products()->attach($product->id, [
                        'quantity' => $product->pivot->quantity,
                        'price' => $product->price
                    ]);

                    $product->decrement('stock', $product->pivot->quantity);
                }

                $cart->products()->detach();
                DB::commit();

                // Enviar email de confirmación
                // Event::dispatch(new OrderCreated($order));

                return Inertia::render('Checkout/Success', [
                    'order' => $order->load(['products.images']),
                    'message' => '¡Gracias por tu compra!'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Error en checkout success: ' . $e->getMessage());
            return redirect()->route('cart.index')
                ->with('error', 'Hubo un error al procesar tu orden: ' . $e->getMessage());
        }
    }

    public function cancel()
    {
        try {
            Log::info('Pago cancelado por el usuario', [
                'user_id' => Auth::id()
            ]);

            return Inertia::render('Checkout/Cancel', [
                'error' => session('error') ?? 'El pago ha sido cancelado. Tu carrito se mantiene intacto.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error en checkout cancel: ' . $e->getMessage());
            return redirect()->route('cart.index')
                ->with('error', 'Hubo un error al procesar la cancelación');
        }
    }
}