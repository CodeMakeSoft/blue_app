<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderProduct;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Log;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use App\Models\Cart;

class CheckoutController extends Controller
{
    private $client;

    public function createPaypalOrder(Request $request)
{
    $user = Auth::user();
    $cart = $user->cart;
    $products = $cart->products()->withPivot('quantity')->get();

    $total = $products->sum(fn($p) => $p->price * $p->pivot->quantity);

    $provider = new PayPalClient;
    $provider->setApiCredentials(config('paypal'));
    $paypalToken = $provider->getAccessToken();

    $order = $provider->createOrder([
        "intent" => "CAPTURE",
        "application_context" => [
            "return_url" => route('checkout.success'),
            "cancel_url" => route('checkout.cancel'),
        ],
        "purchase_units" => [
            [
                "amount" => [
                    "currency_code" => "MXN",
                    "value" => number_format($total, 2, '.', '')
                ]
            ]
        ]
    ]);

    return response()->json($order);
}

public function capturePaypalOrder(Request $request)
{
    $provider = new PayPalClient;
    $provider->setApiCredentials(config('paypal'));
    $provider->getAccessToken();

    $response = $provider->capturePaymentOrder($request->orderID);

    if ($response['status'] === 'COMPLETED') {
        DB::beginTransaction();
        try {
            $user = Auth::user();
            $cart = $user->cart;
            $products = $cart->products()->withPivot('quantity')->get();

            $total = $products->sum(fn($p) => $p->price * $p->pivot->quantity);

            $order = Order::create([
                'user_id' => $user->id,
                'payment_method' => 'paypal',
                'total' => $total,
                'status' => 'paid'
            ]);

            foreach ($products as $product) {
                $order->products()->attach($product->id, [
                    'quantity' => $product->pivot->quantity,
                    'price' => $product->price,
                ]);
            }

            $cart->products()->detach();

            DB::commit();

            session()->flash('order_id', $order->id);
            session()->flash('isCod', false);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);
            return response()->json(['error' => 'Error al capturar el pago.'], 500);
        }
    }

    return response()->json(['error' => 'No se completó el pago con PayPal.'], 400);
}

    public function index()
    {
        $user = Auth::user();
        $cart = $user->cart;
        $products = $cart->products()->withPivot('quantity')->get();
        
        return inertia('Checkout/Index', [
            'cart' => $products,
            'paypalClientId' => config('paypal.sandbox.client_id'), // o config('services.paypal.client_id')
            'paymentMethods' => ['paypal' => 'PayPal', 'cod' => 'Pago contra entrega']
        ]);
    }

    // Nuevo método para procesar COD
    public function processCod(Request $request)
    {
        $user = Auth::user();
        $cart = $user->cart;

        try {
            DB::beginTransaction();

            $total = $cart->products->sum(fn($p) => $p->price * $p->pivot->quantity);

            $order = Order::create([
                'user_id' => $user->id,
                'payment_method' => 'cod',
                'total' => $total,
                'status' => 'pending'
            ]);

            foreach ($cart->products as $product) {
                $order->products()->attach($product->id, [
                    'quantity' => $product->pivot->quantity,
                    'price' => $product->price,
                ]);
            }

            $cart->products()->detach();

            DB::commit();

            session()->flash('order_id', $order->id);
            session()->flash('isCod', true);

            return redirect()->route('checkout.success');
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);
            return redirect()->route('checkout.cancel')->withErrors([
                'message' => 'Error procesando el pedido. Intenta nuevamente.'
            ]);
        }
    }

public function success(Request $request)
    {
        $orderId = session('order_id');

        if ($orderId) {
            $order = Order::with('products')->findOrFail($orderId);

            return inertia('Checkout/Success', [
                'order' => $order,
                'isCod' => session('isCod', false)
            ]);
        }

        return redirect()->route('checkout.index');
    }

    public function cancel()
    {
        return inertia('Checkout/Cancel');
    }

    public function buyNow($productId)
    {
        $product = Product::findOrFail($productId);
        $user = Auth::user();
    
        // Verificar si el usuario ya tiene un carrito
        $cart = $user->cart ?? Cart::create(['user_id' => $user->id]);
    
        // Verificar si el producto ya está en el carrito, si no está, agregarlo
        $cartProduct = $cart->products()->where('product_id', $productId)->first();
    
        if ($cartProduct) {
            // Si ya existe, actualizar la cantidad si es necesario
            $cart->products()->updateExistingPivot($productId, [
                'quantity' => $cartProduct->pivot->quantity + 1,
            ]);
        } else {
            // Si no está en el carrito, agregarlo
            $cart->products()->attach($productId, [
                'quantity' => 1,
            ]);
        }
    
        // Redirigir al checkout para proceder con la compra
        return redirect()->route('checkout.index');
    }    

}