import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Checkout from '@/Components/Checkout/Checkout';
import Breadcrumb from '@/Components/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

export default function Index({ cart = [], paymentMethods }) {
    const { paypalClientId } = usePage().props;
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const [isCheckoutConfirmVisible, setIsCheckoutConfirmVisible] = React.useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: 'Inicio', link: route('dashboard') },
                            { name: 'Carrito', link: route('cart.index') },
                        ]}
                        currentPage="Finalizar Compra"
                    />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCreditCard} className="text-blue-600 dark:text-blue-500" />
                        Finalizar Compra
                    </h2>
                </div>
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
