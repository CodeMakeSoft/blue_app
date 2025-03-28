import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';

export default function CheckoutForm({ stripeKey }) {
    const [error, setError] = useState('');
    const { data, setData, processing, errors } = useForm({
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_zip: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const stripe = await loadStripe(stripeKey);
            
            const response = await fetch(route('checkout.session'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': window.csrfToken,
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const session = await response.json();

            if (session.error) {
                setError(session.error);
                return;
            }

            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                setError(result.error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al procesar el pago');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {error && (
                <div className="mb-4 p-4 bg-red-50 rounded-md">
                    <p className="text-red-700">{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Dirección de envío
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

                {/* Similar pattern for other form fields */}
                
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

CheckoutForm.propTypes = {
    stripeKey: PropTypes.string.isRequired
};