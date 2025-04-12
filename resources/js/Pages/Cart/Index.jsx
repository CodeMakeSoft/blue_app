import React, { useState, useEffect } from "react";
import Cart from "@/Components/Cart/Cart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react"; // Importa router
import { calculateCartTotals } from "@/Utils/CartUtils";
import { Link } from '@inertiajs/react';
import { useToast } from "@/hooks/use-toast";

export default function Index({ cart = [] }) {
    const { toast } = useToast();
    const [currentTotal, setCurrentTotal] = useState(
        Array.isArray(cart) ? calculateCartTotals(cart) : calculateCartTotals([])
    );

    useEffect(() => {
        if (Array.isArray(cart)) {
            setCurrentTotal(calculateCartTotals(cart));
        }
    }, [cart]);

    const handleQuantityChange = (productId, quantity) => {
        router.visit(
            route('cart.update', productId),
            {
                method: 'put',
                data: { quantity },
                preserveScroll: true,
                onSuccess: (response) => {
                    const updatedCart = response.props.cart || [];
                    if (!Array.isArray(updatedCart)) {
                        console.error("El carrito devuelto por el backend no es un arreglo válido.");
                        return;
                    }

                    setCurrentTotal(calculateCartTotals(updatedCart));

                    // Mostrar el toast en el éxito
                    toast({
                        title: "Cantidad actualizada",
                        description: `La cantidad del producto ha sido actualizada correctamente.`,
                    });
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
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
                    <div className="text-center text-gray-600 dark:text-gray-400 mt-6">
                        <p>Tu carrito está vacío.</p>
                        <Link
                            href={route('dashboard')}
                            className="underline text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            Continúa comprando
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
