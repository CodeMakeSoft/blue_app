import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'; // Importa router
import Confirm from '@/Components/Cart/Confirm';
import { calculateCartTotals } from '@/Utils/CartUtils';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function ProductList({ products, onQuantityChange, onConfirmCheckout, isCartEmpty }) {
    const [cartProducts, setCartProducts] = useState(products);
    const [confirmProductId, setConfirmProductId] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para el índice de la imagen
    const [imageIndexes, setImageIndexes] = useState(
        products.reduce((acc, product) => {
            acc[product.id] = 0; // Inicializa el índice de cada producto en 0
            return acc;
        }, {})
    );

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
            route('cart.destroy', productId),
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

    const goToNextImage = (productId) => {
        setImageIndexes((prevIndexes) => {
            const currentIndex = prevIndexes[productId];
            const newIndex = currentIndex === products.find((product) => product.id === productId).images.length - 1 ? 0 : currentIndex + 1;
            return { ...prevIndexes, [productId]: newIndex };
        });
    };

    const goToPrevImage = (productId) => {
        setImageIndexes((prevIndexes) => {
            const currentIndex = prevIndexes[productId];
            const newIndex = currentIndex === 0 ? products.find((product) => product.id === productId).images.length - 1 : currentIndex - 1;
            return { ...prevIndexes, [productId]: newIndex };
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-[1rem]">
            {/* Lista de productos */}
            <ul className="divide-y divide-slate-100">
                {cartProducts.map((product) => (
                    <li key={product.id} className="flex flex-col md:flex-row items-center gap-6 py-6 relative">
                        {/* Botón de eliminar sobre la imagen */}
                        <button
                            onClick={() => setConfirmProductId(product.id)}
                            className="absolute top-2 left-2 text-gray-400 hover:text-red-500 bg-white p-1 rounded-full shadow-md z-10 transform hover:scale-105 transition duration-200"
                        >
                            <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
        
                        {/* Confirmación de eliminación */}
                        {confirmProductId === product.id && (
                            <Confirm
                                title={`Eliminar "${product.name}"`}
                                message="¿Estás seguro de eliminar este producto?"
                                onConfirm={() => handleRemoveProduct(product.id)}
                                onCancel={handleCancelRemove}
                            />
                        )}
        
                        {/* Imagen */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
                            {product.images.length > 1 && (
                                <button 
                                    onClick={() => goToPrevImage(product.id)} 
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-1 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            )}
                            <img
                                src={product.images.length > 0 ? product.images[imageIndexes[product.id]].url : null}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md bg-slate-100 transition-opacity duration-300 ease-in-out"
                            />
                            {product.images.length > 1 && (
                                <button 
                                    onClick={() => goToNextImage(product.id)} 
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-1 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            )}
                        </div>


                        {/* Detalles */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg md:text-2xl font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-gray-500 text-sm md:text-base">{product.description}</p>
                            
                            {/* Características */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                <span className="bg-[#1F2937] text-white rounded-lg text-sm font-semibold px-3 py-1">
                                    Talla: {product.size}
                                </span>
                                <span className="bg-[#1F2937] text-white rounded-lg text-sm font-semibold px-3 py-1">
                                    Color: {product.color}
                                </span>
                                <span className="bg-[#1F2937] text-white rounded-lg text-sm font-semibold px-3 py-1">
                                    Precio: ${product.price}
                                </span>
                                <span className="bg-green-500 text-white rounded-lg text-sm font-semibold px-3 py-1 flex items-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Stock: {product.stock}
                                </span>
                            </div>
                        </div>
        
                        {/* Controles de cantidad y precio total */}
                        <div className="flex flex-col items-center md:items-end gap-4 md:ml-auto">
                            <p className="text-lg font-semibold text-gray-900">{product.pivot.quantity} unidades ${(
                                product.price * product.pivot.quantity
                            ).toFixed(2)}</p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleQuantityChangeLocal(product.id, Math.max(product.pivot.quantity - 1, 1))}
                                    disabled={product.pivot.quantity <= 1}
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    -
                                </button>
                                <span className="text-lg font-semibold">{product.pivot.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChangeLocal(product.id, Math.min(product.pivot.quantity + 1, product.stock))}
                                    disabled={product.pivot.quantity >= product.stock}
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        
            {/* Resumen del carrito */}
            {cartProducts.length > 0 && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Envío</span>
                        <span>${totals.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totals.total.toFixed(2)}</span>
                    </div>
        
                    {/* Botones */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <Link 
                            href={route('dashboard')} 
                            className="flex-1 px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-center font-medium"
                        >
                            Seguir Comprando
                        </Link>
                        <button
                            onClick={() => !isCartEmpty && onConfirmCheckout()}
                            disabled={isCartEmpty}
                            className={`flex-1 px-5 py-3 text-white rounded-lg text-center font-medium transition duration-200 ${isCartEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            Proceder al Pago
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
