import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Checkout from '@/Components/Checkout/Checkout';
import Breadcrumb from '@/Components/Breadcrumb';

export default function Index({ cart = [], paymentMethods }) {
    const { paypalClientId } = usePage().props;
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const [isCheckoutConfirmVisible, setIsCheckoutConfirmVisible] = React.useState(false);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <Breadcrumb
                        routes={[
                            { name: 'Inicio', link: route('dashboard') },
                            { name: 'Carrito', link: route('checkout.index') },
                        ]}
                        currentPage="Finalizar Compra"
                    />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white mt-2">
                        Finalizar Compra
                    </h2>
                </>
            }
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
