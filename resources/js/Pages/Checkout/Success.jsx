import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react"; 
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Success({ order, isCod }) {
    const [showConfetti, setShowConfetti] = useState(true);
    const [width, height] = useWindowSize();

    useEffect(() => {
        const timeoutConfetti = setTimeout(() => setShowConfetti(false), 5000);

        const timeoutRedirect = setTimeout(() => {
            router.visit(route("purchases.index")); // ✅ Redirección correcta
        }, 7000);

        return () => {
            clearTimeout(timeoutConfetti);
            clearTimeout(timeoutRedirect);
        };
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            { name: "Compras", link: route("purchases.index") },
                        ]}
                        currentPage="Compra Exitosa"
                    />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white mt-2">
                        Compra Exitosa
                    </h2>
                </>
            }
        >
            <Head title="Compra Exitosa" />

            {showConfetti && <Confetti width={width} height={height} />}

            <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4 text-center">
                    ¡Gracias por tu compra!
                </h1>

                <div className="text-gray-700 dark:text-gray-300 text-lg space-y-2">
                    <p>
                        <span className="font-semibold">Método de pago:</span>{" "}
                        {isCod ? "Pago contra entrega" : "PayPal"}
                    </p>
                    <p>
                        <span className="font-semibold">Total:</span> ${order.total}
                    </p>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Detalles del Pedido
                    </h2>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                        {order.products.map((product) => (
                            <li key={product.id} className="py-2 flex justify-between text-gray-700 dark:text-gray-200">
                                <span>{product.name} × {product.pivot.quantity}</span>
                                <span className="font-medium">
                                    ${product.pivot.price * product.pivot.quantity}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pronto recibirás un correo con la confirmación de tu pedido.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
