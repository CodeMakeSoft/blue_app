import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Cancel({ message }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pago Cancelado</h2>}
        >
            <Head title="Cancelación" />

            <div className="p-6 bg-white rounded-lg shadow-md mt-6">
                <p className="text-center text-lg font-semibold text-gray-800">{message}</p>

                {/* Botón para regresar al carrito */}
                <div className="text-center mt-6">
                    <Link
                        href={route('cart.index')}
                        className="inline-block px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                    >
                        Regresar al Carrito
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}