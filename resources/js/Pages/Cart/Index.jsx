import React, { useState, useEffect } from "react";
import Cart from "@/Components/Cart/Cart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { calculateCartTotals } from "@/Utils/CartUtils";
import { Link } from '@inertiajs/react';
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/Components/Breadcrumb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                        ]}
                        currentPage="Carrito"
                    />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-blue-600 dark:text-blue-500" />
                        Tu Carrito
                    </h2>
                </div>
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
                    <div className="text-center text-gray-600 dark:text-gray-400 mt-6 space-y-4">
                        <p>Tu carrito está vacío.</p>
                        <Link
                            href={route('dashboard')}
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                        >
                            Continúa comprando
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
