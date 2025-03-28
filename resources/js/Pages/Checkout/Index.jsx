import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CheckoutForm from '@/Components/Checkout/CheckoutForm';
import OrderSummary from '@/Components/Checkout/OrderSummary';
import PropTypes from 'prop-types';

export default function Index({ cart, total, stripeKey }) {
    if (!cart || cart.length === 0) {
        return (
            <AuthenticatedLayout>
                <Head title="Error" />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="bg-red-50 p-4 rounded-md">
                        <p className="text-red-700">El carrito está vacío</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CheckoutForm stripeKey={stripeKey} />
                    <OrderSummary cart={cart} total={total} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

Index.propTypes = {
    cart: PropTypes.array.isRequired,
    total: PropTypes.shape({
        subtotal: PropTypes.number.isRequired,
        shipping: PropTypes.number.isRequired,
        taxes: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired
    }).isRequired,
    stripeKey: PropTypes.string.isRequired
};