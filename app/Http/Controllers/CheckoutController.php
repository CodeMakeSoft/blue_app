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
use Illuminate\Support\Facades\Log;

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

    public function createOrder(Request $request)
    {
        // Validamos que vengan productos, total y direcciones si son necesarias
        $validated = $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'shipping_address' => 'required|string|max:255', // Si es necesario
            'billing_address' => 'required|string|max:255', // Si es necesario
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string|max:15'
        ]);
    
        try {
            // Crear la orden
            $order = Order::create([
                'user_id' => Auth::id(), // o usa un ID fijo si no tienes autenticación
                'total' => $validated['total'],
                'status' => 'pending',
                'shipping_address' => $validated['shipping_address'], // Asegurándonos de incluir las direcciones
                'billing_address' => $validated['billing_address'],
                'contact_email' => $validated['contact_email'],
                'contact_phone' => $validated['contact_phone'],
            ]);
    
            // Asociamos los productos a la orden
            foreach ($validated['products'] as $item) {
                $order->products()->attach($item['id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }
    
            // Respondemos con el ID de la orden para que PayPal lo use
            return response()->json([
                'id' => $order->id // Este es el id que PayPal espera
            ]);
    
        } catch (\Throwable $e) {
            Log::error('Error al crear la orden: ' . $e->getMessage());
    
            // Devolver error adecuado en caso de excepción
            return response()->json([
                'error' => 'No se pudo crear la orden.',
                'exception' => $e->getMessage() // Agrega el mensaje de error aquí
            ], 500);
        }
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
}