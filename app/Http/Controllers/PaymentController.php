<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    /**
     * Crea una intención de pago en Stripe.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPaymentIntent(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'amount' => 'required|numeric|min:1', // Monto en centavos
            'currency' => 'required|string', // Moneda (ejemplo: mxn, usd)
        ]);

        // Configurar la clave secreta de Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            // Crear una intención de pago
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount, // Monto en centavos
                'currency' => $request->currency,
                'automatic_payment_methods' => ['enabled' => true], // Habilitar métodos automáticos
            ]);

            // Devolver el clientSecret al frontend
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            // Manejar errores
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Confirma el pago después de que el usuario complete el formulario.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmPayment(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        // Configurar la clave secreta de Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            // Recuperar el Payment Intent
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            // Verificar el estado del pago
            if ($paymentIntent->status === 'succeeded') {
                // Guardar el pedido en la base de datos o realizar otras acciones
                return response()->json([
                    'message' => 'Pago completado exitosamente.',
                    'status' => $paymentIntent->status,
                ]);
            } else {
                return response()->json([
                    'message' => 'El pago no se ha completado.',
                    'status' => $paymentIntent->status,
                ], 400);
            }
        } catch (\Exception $e) {
            // Manejar errores
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
