import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Success({ order, message }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Orden Confirmada</h2>}
        >
            <Head title="Éxito" />

            <div className="p-6 bg-white rounded-lg shadow-md mt-6">
                <p className="text-center text-lg font-semibold text-gray-800">{message}</p>
                <p className="text-center text-gray-600 mt-4">
                    Número de Orden: #{order.id}
                </p>
                <p className="text-center text-gray-600 mt-2">
                    Total: ${order.total.toFixed(2)}
                </p>

                {/* Botón para continuar comprando */}
                <div className="text-center mt-6">
                    <Link
                        href={route('dashboard')}
                        className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                    >
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}