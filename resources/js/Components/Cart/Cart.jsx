import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Cart/Navbar';
import ProductList from '@/Components/Cart/ProductList';

export default function Cart({ cart = [], onQuantityChange }) {
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const [isCheckoutConfirmVisible, setIsCheckoutConfirmVisible] = React.useState(false);

    return (
        <div className="max-w-5xl max-md:max-w-xl mx-auto p-4">
        <Head title="Carrito" />

        <Navbar 
            activeLink="cart.index" 
            isConfirmVisible={isConfirmVisible}
            setIsConfirmVisible={setIsConfirmVisible}
            isCheckoutConfirmVisible={isCheckoutConfirmVisible}
            setIsCheckoutConfirmVisible={setIsCheckoutConfirmVisible}
            isCartEmpty={cart.length === 0}
        />

        {cart.length === 0 ? (
            <p className="text-center text-gray-600 mt-[3em]">Tu carrito está vacío.</p>
        ) : (
            <ProductList 
            products={cart} 
            onQuantityChange={onQuantityChange}
            />
        )}
        </div>
    );
}