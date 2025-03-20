import React from 'react';
import { Head, Link } from '@inertiajs/react'; 

export default function Cart({ cart }) {
    // Calcular el total del carrito
    const calculateTotal = () => {
        return cart.reduce((total, product) => {
            return total + product.price * product.pivot.quantity;
        }, 0);
    };

    return (
        <div className="max-w-5xl max-md:max-w-xl mx-auto p-4">
            <Head title="Carrito" />

            {cart.length === 0 ? (
                <p className="text-center text-gray-600">Tu carrito está vacío.</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-10">
                    {/* Lista de productos en el carrito */}
                    <div className="md:col-span-2 space-y-4">
                        {cart.map((product) => (
                            <div key={product.id} className="flex gap-4 bg-white p-6 rounded-lg shadow-md">
                                {/* Imagen del producto */}
                                <div className="w-24 h-24 shrink-0">
                                    <img
                                        src={product.images.length > 0 ? product.images[0].url : NULL}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>

                                {/* Detalles del producto */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                    <p className="text-sm text-gray-500">{product.description}</p>
                                    <p className="text-sm text-gray-500">Tamaño: {product.size}</p>
                                    <p className="text-sm text-gray-500">Color: {product.color}</p>
                                    <p className="text-sm text-gray-500">Precio: ${product.price}</p>

                                    {/* Contador de cantidad */}
                                    <div className="mt-4 flex items-center gap-3">
                                        <Link
                                            href={route('cart.update', product.id)}
                                            method="post"
                                            data={{ quantity: product.pivot.quantity - 1 }}
                                            as="button"
                                            className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300"
                                        >
                                            <span className="text-sm">-</span>
                                        </Link>
                                        <span className="text-sm">{product.pivot.quantity}</span>
                                        <Link
                                            href={route('cart.update', product.id)}
                                            method="post"
                                            data={{ quantity: product.pivot.quantity + 1 }}
                                            as="button"
                                            className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300"
                                        >
                                            <span className="text-sm">+</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Eliminar producto y precio total */}
                                <div className="flex flex-col items-end justify-between">
                                    <Link
                                        href={route('cart.remove', product.id)}
                                        method="post"
                                        as="button"
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                    <p className="text-lg font-semibold text-gray-900">
                                        ${(product.price * product.pivot.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen del carrito */}
                    <div className=" bg-white p-6 rounded-lg shadow-lg md:top-4 md:h-fit">
                        <h2 className="text-xl font-bold mb-4">Resumen del Carrito</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
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
                                <span className="text-lg font-bold">${(calculateTotal() + 7).toFixed(2)}</span>
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
                                href={route('dashboard')} // Cambia 'home' por la ruta correcta
                                className="block w-full text-center bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Seguir Comprando
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}