import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import ProductList from '@/Components/Cart/ProductList';
import Confirm from '@/Components/Confirm';
import { router } from '@inertiajs/react';

export default function Cart({ cart = [], onQuantityChange }) {
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

    const handleConfirmCheckout = () => {
        router.visit(route('checkout.index'));
        setIsConfirmVisible(false);
    };

    return (
        <div className="max-w-5xl max-md:max-w-xl mx-auto p-4">
            <Head title="Carrito" />

            {cart.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-[3em]">
                    Tu carrito está vacío.
                </p>
            ) : (
                <ProductList 
                    products={cart} 
                    onQuantityChange={onQuantityChange}
                    onConfirmCheckout={() => setIsConfirmVisible(true)}
                    isCartEmpty={cart.length === 0}
                />
            )}

            {isConfirmVisible && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <Confirm
                            title="Confirmación de Compra"
                            message="¿Deseas proceder al pago?"
                            onConfirm={handleConfirmCheckout}
                            onCancel={() => setIsConfirmVisible(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
