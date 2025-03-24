import React from 'react';
import { Link } from '@inertiajs/react';

export default function CartSummary({ total }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md my-[1em]">
            <h2 className="text-xl font-bold mb-4">Resumen del Carrito</h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold">$5.00</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-semibold">$2.00</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${(total.subtotal + 7).toFixed(2)}</span>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 space-y-2">
                <button
                    type="button"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Proceder al Pago
                </button>
                <Link
                    href={route('dashboard')}
                    className="block w-full text-center bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                    Seguir Comprando
                </Link>
            </div>
        </div>
    );
}