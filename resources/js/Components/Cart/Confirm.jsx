import React from 'react';
import { Link } from '@inertiajs/react';

export default function Confirm({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Fondo Negro Semi-Transparente */}
            <div className="w-full h-full bg-black opacity-70 absolute"></div>

            {/* Contenedor Blanco (Responsivo) */}
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-11/12 sm:w-3/4 md:w-2/5 lg:w-1/3 relative z-50 text-center">
                <h1 className="text-2xl font-bold mb-8">{title}</h1>
                <p>{message}</p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                    {/* Botón Cancelar */}
                    <button
                        onClick={onCancel}
                        className="block w-full sm:w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancelar
                    </button>

                    {/* Botón Confirmar */}
                    <button
                        onClick={onConfirm}
                        className="block w-full sm:w-1/2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}