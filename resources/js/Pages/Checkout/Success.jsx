import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PropTypes from 'prop-types';

export default function Success({ order, message }) {
    if (!order) {
        return (
            <AuthenticatedLayout>
                <Head title="Error" />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="bg-red-50 p-4 rounded-md">
                        <p className="text-red-700">Error: Orden no encontrada</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Orden Completada" />
            
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    {/* Cabecera con mensaje de éxito */}
                    <div className="text-center p-6 bg-green-50">
                        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">{message}</h2>
                        <p className="mt-2 text-gray-600">
                            Orden #{order.id} - {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Detalles de la orden */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Detalles del Envío</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p className="text-gray-600">Dirección:</p>
                                <p>{order.shipping_address}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Ciudad:</p>
                                <p>{order.shipping_city}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Estado:</p>
                                <p>{order.shipping_state}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Código Postal:</p>
                                <p>{order.shipping_zip}</p>
                            </div>
                        </div>

                        {/* Número de seguimiento si existe */}
                        {order.tracking_number && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-md">
                                <p className="text-sm text-blue-700">
                                    Número de seguimiento: {order.tracking_number}
                                </p>
                            </div>
                        )}

                        {/* Lista de productos */}
                        <h3 className="text-lg font-semibold mb-4">Productos</h3>
                        <div className="space-y-4">
                            {order.products.map((product) => (
                                <div key={product.id} className="flex items-center border-b pb-4">
                                    <div className="h-20 w-20 flex-shrink-0">
                                        <img
                                            src={product.images[0]?.url}
                                            alt={product.name}
                                            className="h-full w-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h4 className="font-medium">{product.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            Cantidad: {product.pivot.quantity}
                                        </p>
                                        <p className="text-sm font-medium">
                                            ${product.pivot.price} c/u
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ${(product.pivot.price * product.pivot.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen de costos */}
                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>
                                    ${order.products.reduce((acc, product) => 
                                        acc + (product.pivot.price * product.pivot.quantity), 0
                                    ).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span>${order.shipping_cost?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Impuestos</span>
                                <span>${order.tax?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t pt-2">
                                <span>Total</span>
                                <span>${order.total}</span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 flex justify-center space-x-4">
                            <Link
                                href={route('dashboard')}
                                className="bg-[#1F2937] text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Seguir Comprando
                            </Link>
                            <Link
                                href={route('orders.download-invoice', order.id)}
                                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Descargar Factura
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

Success.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.number.isRequired,
        created_at: PropTypes.string.isRequired,
        shipping_address: PropTypes.string.isRequired,
        shipping_city: PropTypes.string.isRequired,
        shipping_state: PropTypes.string.isRequired,
        shipping_zip: PropTypes.string.isRequired,
        tracking_number: PropTypes.string,
        shipping_cost: PropTypes.number,
        tax: PropTypes.number,
        total: PropTypes.number.isRequired,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                images: PropTypes.arrayOf(
                    PropTypes.shape({
                        url: PropTypes.string.isRequired
                    })
                ),
                pivot: PropTypes.shape({
                    quantity: PropTypes.number.isRequired,
                    price: PropTypes.number.isRequired
                })
            })
        ).isRequired
    }),
    message: PropTypes.string.isRequired
};