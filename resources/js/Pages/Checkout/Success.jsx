import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Success({ order }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">¡Compra Exitosa!</h2>}
        >
            <Head title="Compra Exitosa" />
            
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 bg-white border-b border-gray-200">
                            {/* Encabezado de confirmación */}
                            <div className="text-center mb-8">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Completado con Éxito!</h1>
                                <p className="text-lg text-gray-600">Hemos recibido tu pedido #{order.id}</p>
                                <p className="text-gray-500 mt-2">Recibirás un correo de confirmación con los detalles.</p>
                            </div>

                            {/* Resumen del pedido */}
                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de tu pedido</h2>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Número de pedido:</span>
                                        <span>#{order.id}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Fecha:</span>
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Método de pago:</span>
                                        <span>PayPal</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                                        <span>Total:</span>
                                        <span>${order.total.toFixed(2)} MXN</span>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                                <Link 
                                    href={route('orders.show', order.id)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-center font-medium shadow-sm"
                                >
                                    Ver detalles del pedido
                                </Link>
                                <Link 
                                    href={route('dashboard')} 
                                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 text-center font-medium shadow-sm"
                                >
                                    Seguir comprando
                                </Link>
                            </div>

                            {/* Información adicional */}
                            <div className="mt-10 text-center text-sm text-gray-500">
                                <p>¿Tienes alguna pregunta? <Link href={route('contact')} className="text-blue-600 hover:text-blue-500">Contáctanos</Link></p>
                                <p className="mt-2">Tiempo estimado de entrega: 3-5 días hábiles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}