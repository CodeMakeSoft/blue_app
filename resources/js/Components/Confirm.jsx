import React from 'react';
import { Link } from '@inertiajs/react';

export default function Confirm({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300">
            {/* Fondo Semi-Transparente */}
            <div className="absolute w-full h-full bg-black opacity-50"></div>

            {/* Contenedor Blanco (Responsivo) */}
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-11/12 sm:w-3/4 md:w-2/5 lg:w-1/3 relative z-10 transition-transform transform hover:scale-105">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">{title}</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Botón Cancelar */}
                    <button
                        onClick={onCancel}
                        className="w-full sm:w-1/2 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none transition duration-200"
                    >
                        Cancelar
                    </button>

                    {/* Botón Confirmar */}
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-1/2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 focus:outline-none transition duration-200"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
