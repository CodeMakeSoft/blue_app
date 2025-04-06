import React, { useState, useEffect } from "react";
import Cart from "@/Components/Cart/Cart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react"; // Importa router
import { calculateCartTotals } from "@/Utils/CartUtils";
import { Link } from '@inertiajs/react';

export default function Index({ cart = [] }) {
    // Calcula los totales iniciales usando CartUtils
    const [currentTotal, setCurrentTotal] = useState(
        Array.isArray(cart) ? calculateCartTotals(cart) : calculateCartTotals([])
    );

    // Recalcula los totales cuando cambia el carrito
    useEffect(() => {
        if (Array.isArray(cart)) {
            setCurrentTotal(calculateCartTotals(cart));
        }
    }, [cart]);

    // Función para manejar cambios de cantidad
    const handleQuantityChange = (productId, quantity) => {
        router.visit(
            route('cart.update', productId),
            {
                method: 'put',
                data: { quantity },
                preserveScroll: true, // Mantén la posición del scroll
                onSuccess: (response) => {
                    const updatedCart = response.props.cart || [];
                    if (!Array.isArray(updatedCart)) {
                        console.error("El carrito devuelto por el backend no es un arreglo válido.");
                        return;
                    }

                    setCurrentTotal(calculateCartTotals(updatedCart)); // Recalcula los totales
                },
                onError: (error) => {
                    console.error("Error al actualizar el carrito:", error);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Your Cart
                </h2>
            }
        >
            <Head title="Cart" />
            <div>
                {cart.length > 0 ? (
                    <Cart 
                        cart={cart}
                        onQuantityChange={handleQuantityChange}
                    />
                ) : (
                    <div className="text-center text-gray-600 mt-6">
                        <p>Tu carrito está vacío.</p>
                        <Link href={route('dashboard')} className="underline text-blue-500">
                            Continúa comprando
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}