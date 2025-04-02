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

    // Función para iniciar el proceso de pago con Stripe
    const createStripeSession = async () => {
        try {
            const response = await axios.post(route('checkout.createSession'), {
                cartProducts: cart.map((product) => ({
                    id: product.id,
                    quantity: product.pivot.quantity,
                })),
                total: currentTotal.total * 100, // Multiplica por 100 para enviar el total en centavos
            });

            if (response.data.id) {
                const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
                await stripe.redirectToCheckout({ sessionId: response.data.id });
            } else {
                alert("Ocurrió un error al iniciar el pago.");
            }
        } catch (error) {
            console.error("Error al crear la sesión de Stripe:", error);
            alert("No se pudo iniciar la sesión de pago. Inténtalo de nuevo más tarde.");
        }
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
                        onConfirmCheckout={createStripeSession} // Pasa la función para iniciar Stripe
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