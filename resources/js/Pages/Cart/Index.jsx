import React, { useState } from "react";
import Cart from "@/Components/Cart/Cart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function Index({ cart, total }) {
    const [currentTotal, setCurrentTotal] = useState(total || { subtotal: 0, taxes: 0, total: 0 });
    const handleQuantityChange = (productId, quantity) => {
        Inertia.put(
            route('cart.update', productId),
            { quantity },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (response) => {
                    // Actualiza el estado del resumen con los datos del servidor
                    setCurrentTotal(response.props.total);
                },
                onError: (error) => {
                    console.error('Error al actualizar el carrito:', error);
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
                <Cart 
                    cart={cart}
                    total={currentTotal}
                    onQuantityChange={handleQuantityChange}
                />
            </div>
        </AuthenticatedLayout>
    );
}

