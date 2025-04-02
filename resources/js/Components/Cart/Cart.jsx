import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Cart/Navbar';
import ProductList from '@/Components/Cart/ProductList';
import CartSummary from '@/Components/Cart/CartSummary';

export default function Cart({ cart = [], onQuantityChange, onConfirmCheckout }) {
    // Estado para mostrar/ocultar la confirmación parcial
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

    return (
        <div className="max-w-5xl max-md:max-w-xl mx-auto p-4">
            <Head title="Carrito" />

            {/* Navbar */}
            <Navbar 
                activeLink="cart.index" 
                isConfirmVisible={isConfirmVisible} 
                setIsConfirmVisible={setIsConfirmVisible}
                isCartEmpty={cart.length === 0}
            />

            {/* Lista de productos en el carrito */}
            {cart.length === 0 ? (
                <p className="text-center text-gray-600 mt-[3em]">Tu carrito está vacío.</p>
            ) : (
                <>
                    <ProductList 
                        products={cart} 
                        onQuantityChange={onQuantityChange}
                        onConfirmCheckout={onConfirmCheckout}
                        isCartEmpty={cart.length === 0}
                    />
                </>
            )}
        </div>
    );
}

