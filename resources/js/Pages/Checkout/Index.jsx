import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Checkout from '@/Components/Checkout/Checkout';

export default function Index({ cart = [], paymentMethods }) {
    const { paypalClientId } = usePage().props;
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const [isCheckoutConfirmVisible, setIsCheckoutConfirmVisible] = React.useState(false);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Finalizar Compra</h2>}
        >
            <Head title="Checkout" />
            <Checkout 
                cart={cart}
                paymentMethods={paymentMethods}
                paypalClientId={paypalClientId}
            />
        </AuthenticatedLayout>
    );
}