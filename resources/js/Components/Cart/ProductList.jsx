import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import Confirm from '@/Components/Cart/Confirm'; // Importamos el componente Confirm
import { Inertia } from '@inertiajs/inertia'; // Importar Inertia

export default function ProductList({ products }) {
    const [cartProducts, setCartProducts] = useState(products);
    const [confirmProductId, setConfirmProductId] = useState(null);

    // Función para actualizar la cantidad de un producto
    const handleQuantityUpdate = (productId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);

        if (isNaN(quantity) || quantity < 0) {
            console.error('Cantidad inválida:', newQuantity);
            return;
        }

        if (quantity === 0) {
            handleRemoveProduct(productId);
            return;
        }

        setCartProducts(
            cartProducts.map((product) =>
                product.id === productId 
                    ? { ...product, pivot: { ...product.pivot, quantity: quantity } } 
                    : product
            )
        );

        Inertia.post(route('cart.update', productId), { quantity }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => console.log('Carrito actualizado'),
            onError: (error) => console.error('Error al actualizar el carrito:', error),
        });
    };

    // Función para manejar la eliminación de un producto
    const handleRemoveProduct = (productId) => {
        setCartProducts(cartProducts.filter((product) => product.id !== productId));
        setConfirmProductId(null);

        Inertia.post(route('cart.remove', productId), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => console.log('Producto eliminado'),
            onError: (error) => console.error('Error al eliminar el producto:', error),
        });
    };

    // Función para cancelar la eliminación
    const handleCancelRemove = () => {
        setConfirmProductId(null);
    };

    return (
        <ul className="divide-y divide-slate-100 bg-white p-6 rounded-lg shadow-md mt-[1em]">
            {cartProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                    <div >
                        <li className="flex gap-4 p-6 border_bottom">
                            {/* Imagen del producto */}
                            <div className="w-24 h-24 shrink-0">
                                <img
                                    src={product.images.length > 0 ? product.images[0].url : null}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-md bg-slate-100"
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
                                    {/* Botón "-" */}
                                    <button
                                        onClick={() => {
                                            const newQuantity = product.pivot.quantity - 1;
                                            handleQuantityUpdate(product.id, newQuantity);
                                        }}
                                        className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        <span className="text-sm">-</span>
                                    </button>

                                    {/* Mostrar cantidad */}
                                    <span className="text-sm">{product.pivot.quantity}</span>

                                    {/* Botón "+" */}
                                    <button
                                        onClick={() => {
                                            const newQuantity = product.pivot.quantity + 1;
                                            handleQuantityUpdate(product.id, newQuantity);
                                        }}
                                        className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        <span className="text-sm">+</span>
                                    </button>
                                </div>
                            </div>

                            {/* Botón para eliminar el producto */}
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setConfirmProductId(product.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* Renderizar la ventana modal si confirmProductId coincide con el producto actual */}
                                {confirmProductId === product.id && (
                                    <Confirm
                                        title={`Eliminar "${product.name}"`}
                                        message="¿Estás seguro de eliminar este producto?"
                                        onConfirm={() => handleRemoveProduct(product.id)}
                                        onCancel={handleCancelRemove}
                                    />
                                )}

                                {/* Precio total del producto */}
                                <p className="text-lg font-semibold text-gray-900">
                                    ${(product.price * product.pivot.quantity).toFixed(2)}
                                </p>
                            </div>
                        </li>
                    </div>
                    <hr className="my-3 border-t" />
                </React.Fragment>
            ))}
        </ul>
    );
}