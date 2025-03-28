import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Confirm from '@/Components/Cart/Confirm';

export default function CartSummary({ total }) {
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    // Función para manejar la confirmación
    const handleConfirm = () => {
        console.log('Compra confirmada');
        setIsConfirmVisible(false);
    };

    // Función para manejar la cancelación
    const handleCancel = () => {
        console.log('Compra cancelada');
        setIsConfirmVisible(false);
    };

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
                    <span className="font-semibold">${total.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-semibold">${total.taxes.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${total.total.toFixed(2)}</span>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 space-y-2">
                <button
                    type="button"
                    onClick={() => setIsConfirmVisible(true)}
                    className="w-full bg-[#1F2937] text-white py-2 rounded-lg hover:bg-gray-500"
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

            {/* Modal de Confirmación */}
            {isConfirmVisible && (
                <Confirm
                    title="Confirmación de Compra"
                    message="¿Estás seguro de realizar esta compra?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}