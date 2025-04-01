import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'; // Importa router
import Confirm from '@/Components/Cart/Confirm';
import { calculateCartTotals } from '@/Utils/CartUtils';

export default function ProductList({ products, onQuantityChange }) {
    const [cartProducts, setCartProducts] = useState(products);
    const [confirmProductId, setConfirmProductId] = useState(null);

    // Calcula los totales usando calculateCartTotals
    const totals = calculateCartTotals(cartProducts);

    const handleQuantityChangeLocal = (productId, newQuantity) => {
        const product = cartProducts.find((p) => p.id === productId);

        if (!product) return;

        // Validar límites de cantidad
        if (newQuantity < 0 || newQuantity > product.stock) {
            alert(
                newQuantity < 0
                    ? 'La cantidad mínima es 0.'
                    : `No puedes agregar más de ${product.stock} unidades de este producto.`
            );
            return;
        }

        // Actualiza el estado local de cartProducts
        setCartProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === productId
                    ? { ...p, pivot: { ...p.pivot, quantity: newQuantity } }
                    : p
            )
        );

        // Notifica al padre (Index) para actualizar el carrito
        onQuantityChange(productId, newQuantity);
    };

    const handleRemoveProduct = (productId) => {
        setConfirmProductId(null);

        // Notifica al backend usando router.visit
        router.visit(
            route('cart.remove', productId),
            {
                method: 'delete',
                preserveScroll: true, // Mantén la posición del scroll
                onSuccess: (response) => {
                    if (response.props.cart) {
                        setCartProducts(response.props.cart); // Actualiza el estado local con la respuesta del servidor
                    }
                },
                onError: (error) => {
                    console.error('Error al eliminar el producto:', error);
                },
            }
        );
    };

    const handleCancelRemove = () => {
        setConfirmProductId(null);
    };

    return (
        <div>
            {/* Lista de productos */}
            <ul className="divide-y divide-slate-100 bg-white p-6 rounded-lg shadow-md mt-[1em]">
                {cartProducts.map((product) => (
                    <React.Fragment key={product.id}>
                        <div>
                            <li className="flex gap-4 p-6 border-bottom my-[1em]">
                                {/* Mostrar imagen */}
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
                                    <p className="text-sm text-gray-500">Stock disponible: {product.stock}</p>
                                    {/* Botones para cambiar cantidad */}
                                    <div className="mt-4 flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                const newQuantity = Math.max(product.pivot.quantity - 1, 0);
                                                handleQuantityChangeLocal(product.id, newQuantity);
                                            }}
                                            disabled={product.pivot.quantity <= 1}
                                            className={`flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300 ${
                                                product.pivot.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            <span className="text-sm">-</span>
                                        </button>

                                        <span className="text-sm">{product.pivot.quantity}</span>

                                        <button
                                            onClick={() => {
                                                const newQuantity = Math.min(product.pivot.quantity + 1, product.stock);
                                                handleQuantityChangeLocal(product.id, newQuantity);
                                            }}
                                            disabled={product.pivot.quantity >= product.stock}
                                            className={`flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300 ${
                                                product.pivot.quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            <span className="text-sm">+</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Acciones adicionales */}
                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setConfirmProductId(product.id);
                                        }}
                                        className="text-gray-400 hover:text-[#D1130F]"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {/* Ventana de confirmación */}
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
                    </React.Fragment>
                ))}
            </ul>

            {/* Resumen del carrito */}
            {cartProducts.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-md mt-6">
                    <div className="flex justify-between mb-4">
                        <span>Subtotal</span>
                        <span>${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span>Envío</span>
                        <span>${totals.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totals.total.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}