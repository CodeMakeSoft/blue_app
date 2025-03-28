import React from 'react';
import { useForm } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutForm({ stripeKey }) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_zip: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Inicializar Stripe
            const stripe = await loadStripe(stripeKey);
            
            // Crear sesión de Stripe
            const response = await fetch(route('checkout.session'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(data)
            });

            const session = await response.json();

            if (session.error) {
                alert(session.error);
                return;
            }

            // Redirigir a Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar el pago');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Información de Envío</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Dirección
                    </label>
                    <input
                        type="text"
                        value={data.shipping_address}
                        onChange={e => setData('shipping_address', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                    {errors.shipping_address && (
                        <p className="mt-1 text-sm text-red-600">{errors.shipping_address}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Ciudad
                    </label>
                    <input
                        type="text"
                        value={data.shipping_city}
                        onChange={e => setData('shipping_city', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Estado
                    </label>
                    <input
                        type="text"
                        value={data.shipping_state}
                        onChange={e => setData('shipping_state', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Código Postal
                    </label>
                    <input
                        type="text"
                        value={data.shipping_zip}
                        onChange={e => setData('shipping_zip', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[#1F2937] text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
                >
                    {processing ? 'Procesando...' : 'Proceder al Pago'}
                </button>
            </form>
        </div>
    );
}