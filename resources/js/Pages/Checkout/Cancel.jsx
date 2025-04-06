import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Cancel() {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pago Cancelado</h2>}
        >
            <Head title="Pago Cancelado" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 text-center">
                            <div className="mb-6">
                                <svg className="w-20 h-20 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-medium mb-2">Pago Cancelado</h3>
                            <p className="text-gray-600 mb-6">No se completó el proceso de pago. Puedes intentarlo nuevamente.</p>
                            
                            <div className="flex justify-center space-x-4">
                                <Link 
                                    href={route('cart.index')} 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Volver al Carrito
                                </Link>
                                <Link 
                                    href={route('dashboard')} 
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                >
                                    Seguir Comprando
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}