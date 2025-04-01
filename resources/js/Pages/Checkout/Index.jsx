import React from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { calculateCartTotals } from '@/Utils/CartUtils';

export default function Show({ cart }) {
    // Calcula los totales usando CartUtils
    const totals = calculateCartTotals(cart);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <Head title="Checkout" />

            {/* Mostrar totales */}
            <div className="p-6 bg-white rounded-lg shadow-md mt-6">
                <div className="flex justify-between mb-4">
                    <span>Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span>Impuestos ({(totals.taxes / totals.subtotal * 100).toFixed(0)}%)</span>
                    <span>${totals.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span>Envío</span>
                    <span>${totals.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                </div>
            </div>

            {/* Botones */}
            <div className="mt-6 flex space-x-3">
                {/* Seguir Comprando */}
                <Link
                    href={route('dashboard')}
                    className="block w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center"
                >
                    Seguir Comprando
                </Link>

                {/* Proceder al Pago */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onConfirmCheckout(); // Llama a la función para iniciar Stripe
                    }}
                    className="block w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-center"
                >
                    Proceder al Pago
                </button>
            </div>

            {/* Lista de productos */}
            <ul className="divide-y divide-slate-100 bg-white p-6 rounded-lg shadow-md mt-[1em]">
                {cart.map((product) => (
                    <li key={product.id} className="flex gap-4 p-6 border-bottom my-[1em]">
                        {/* Mostrar imagen */}
                        <div className="w-24 h-24 shrink-0">
                            <img
                                src={product.images.length > 0 ? product.images[0].url : null}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md bg-slate-100"
                            />
                        </div>

                        {/* Detalles del producto */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">Cantidad: {product.pivot.quantity}</p>
                            <p className="text-sm text-gray-500">Precio: ${product.price}</p>
                        </div>

                        {/* Precio total del producto */}
                        <p className="text-lg font-semibold text-gray-900">
                            ${(product.price * product.pivot.quantity).toFixed(2)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}