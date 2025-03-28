import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PropTypes from 'prop-types';

export default function Cancel({ error }) {
    return (
        <AuthenticatedLayout>
            <Head title="Pago Cancelado" />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    {/* Cabecera con mensaje de cancelación */}
                    <div className="text-center p-6 bg-yellow-50">
                        <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Pago Cancelado</h2>
                        <p className="mt-2 text-gray-600">{error}</p>
                    </div>

                    {/* Información y opciones */}
                    <div className="p-6">
                        {/* Razones comunes */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Razones comunes de cancelación:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li>Cambio de método de pago</li>
                                <li>Revisión del pedido</li>
                                <li>Problemas con la tarjeta</li>
                                <li>Cambio de dirección de envío</li>
                            </ul>
                        </div>

                        {/* Opciones para el usuario */}
                        <div className="bg-gray-50 p-4 rounded-md mb-8">
                            <h3 className="text-lg font-semibold mb-4">¿Qué deseas hacer?</h3>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href={route('checkout.show')}
                                    className="bg-[#1F2937] text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center"
                                >
                                    Intentar Nuevamente
                                </Link>
                                <Link
                                    href={route('cart.index')}
                                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
                                >
                                    Volver al Carrito
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
                                >
                                    Seguir Comprando
                                </Link>
                            </div>
                        </div>

                        {/* Soporte */}
                        <div className="text-center text-sm text-gray-500">
                            <p className="mb-2">¿Necesitas ayuda con tu pago?</p>
                            <p>
                                Contáctanos a{' '}
                                <a 
                                    href="mailto:soporte@tutienda.com" 
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    soporte@tutienda.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

Cancel.propTypes = {
    error: PropTypes.string
};

Cancel.defaultProps = {
    error: 'El pago ha sido cancelado. Tu carrito se mantiene intacto.'
};