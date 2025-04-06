<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use App\Models\Order;
use App\Models\OrderProduct;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;

class CheckoutController extends Controller
{
    private $client;

    public function __construct()
    {
        $clientId = config('services.paypal.client_id');
        $clientSecret = config('services.paypal.secret');
        
        $environment = config('services.paypal.mode') === 'live'
            ? new ProductionEnvironment($clientId, $clientSecret)
            : new SandboxEnvironment($clientId, $clientSecret);

        $this->client = new PayPalHttpClient($environment);
    }

    public function index()
    {
        $user = Auth::user();
        $cart = $user->cart;
        $products = $cart->products()->withPivot('quantity')->get();
        
        return inertia('Checkout/Index', [
            'cart' => $products,
            'paypalClientId' => config('services.paypal.client_id'),
            'paymentMethods' => ['paypal' => 'PayPal', 'cod' => 'Pago contra entrega'] // Nuevo
        ]);
    }

    // Método para crear orden PayPal (existente)
    public function createOrder(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric|min:0.1'
        ]);

        $paypalRequest = new OrdersCreateRequest();
        $paypalRequest->prefer('return=representation');
        
        $paypalRequest->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                "amount" => [
                    "currency_code" => "MXN",
                    "value" => $request->total
                ]
            ]],
            "application_context" => [
                "cancel_url" => route('checkout.cancel'),
                "return_url" => route('checkout.success')
            ]
        ];

        try {
            $response = $this->client->execute($paypalRequest);
            return response()->json($response->result);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Nuevo método para procesar COD
    public function processCod(Request $request)
    {
        $user = Auth::user();
        $cart = $user->cart;

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => $user->id,
                'payment_method' => 'cod',
                'total' => $cart->products->sum(function ($product) {
                    return $product->price * $product->pivot->quantity;
                }),
                'status' => 'pending' // Estado inicial para COD
            ]);

            foreach ($cart->products as $product) {
                OrderProduct::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $product->pivot->quantity,
                    'price' => $product->price
                ]);
            }

            $cart->products()->detach();

            // Opcional: Enviar email diferente para COD
            Mail::to($user->email)->send(new OrderConfirmation($order, true));

            DB::commit();

            return inertia('Checkout/Success', [
                'order' => $order,
                'isCod' => true // Para mostrar mensaje diferente en la vista
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            report($e);
            return redirect()->route('checkout.cancel')->withErrors([
                'message' => 'Ocurrió un error al procesar tu orden. Por favor intenta nuevamente.'
            ]);
        }
    }

    // Método success modificado para manejar ambos casos
    public function success(Request $request)
    {
        // Solo procesa PayPal si viene con token
        if ($request->has('token') || $request->has('paymentId')) {
            $user = Auth::user();
            $cart = $user->cart;
            $orderId = $request->input('token') ?? $request->input('paymentId');

            try {
                DB::beginTransaction();

                $order = Order::create([
                    'user_id' => $user->id,
                    'transaction_id' => $orderId,
                    'payment_method' => 'paypal',
                    'total' => $cart->products->sum(function ($product) {
                        return $product->price * $product->pivot->quantity;
                    }),
                    'status' => 'completed'
                ]);

                foreach ($cart->products as $product) {
                    OrderProduct::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $product->pivot->quantity,
                        'price' => $product->price
                    ]);
                }

                $cart->products()->detach();
                Mail::to($user->email)->send(new OrderConfirmation($order));

                DB::commit();

                return inertia('Checkout/Success', [
                    'order' => $order,
                    'isCod' => false
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                report($e);
                return redirect()->route('checkout.cancel')->withErrors([
                    'message' => 'Ocurrió un error al procesar tu orden. Por favor intenta nuevamente.'
                ]);
            }
        }

        return redirect()->route('checkout.index');
    }

    public function cancel()
    {
        return inertia('Checkout/Cancel');
    }
}