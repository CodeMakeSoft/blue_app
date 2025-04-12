import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Confirm from '@/Components/Confirm';
import { calculateCartTotals } from '@/Utils/CartUtils';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTrash,
    faChevronLeft,
    faChevronRight,
    faMinus,
    faPlus,
    faTshirt,
    faPalette,
    faTag,
    faTruck,
    faReceipt,
    faArrowLeft,
    faCreditCard
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/use-toast";

export default function ProductList({ products, onQuantityChange, onConfirmCheckout, isCartEmpty }) {
    const [cartProducts, setCartProducts] = useState(products);
    const [confirmProductId, setConfirmProductId] = useState(null);
    const [imageIndexes, setImageIndexes] = useState(
        products.reduce((acc, product) => {
            acc[product.id] = 0;
            return acc;
        }, {})
    );
    const [editingProductId, setEditingProductId] = useState(null);
    const [inputQuantity, setInputQuantity] = useState('');

    const totals = calculateCartTotals(cartProducts);
    const { toast } = useToast();

    const handleQuantityChangeLocal = (productId, newQuantity) => {
        const product = cartProducts.find((p) => p.id === productId);
        if (!product) return;

        if (newQuantity < 1 || newQuantity > product.stock) {
            alert(
                newQuantity < 1
                    ? 'La cantidad mínima es 1.'
                    : `No puedes agregar más de ${product.stock} unidades de este producto.`
            );
            return;
        }

        setCartProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === productId
                    ? { ...p, pivot: { ...p.pivot, quantity: newQuantity } }
                    : p
            )
        );

        onQuantityChange(productId, newQuantity);
    };

    const handleQuantityInputChange = (e, productId) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setInputQuantity(value);
        }
    };

    const handleQuantityInputBlur = (productId) => {
        if (inputQuantity === '') {
            setEditingProductId(null);
            return;
        }

        let newQuantity = parseInt(inputQuantity, 10);
        const product = cartProducts.find(p => p.id === productId);

        if (isNaN(newQuantity)) {
            newQuantity = product.pivot.quantity;
        } else if (newQuantity < 1) {
            newQuantity = 1;
            alert('La cantidad mínima es 1');
        } else if (newQuantity > product.stock) {
            newQuantity = product.stock;
            alert(`No puedes agregar más de ${product.stock} unidades de este producto`);
        }

        handleQuantityChangeLocal(productId, newQuantity);
        setEditingProductId(null);
        setInputQuantity('');
    };

    const handleQuantityInputKeyDown = (e, productId) => {
        if (e.key === 'Enter') {
            handleQuantityInputBlur(productId);
        }
    };

    const handleRemoveProduct = (productId) => {
    setConfirmProductId(null);
    router.visit(route('cart.destroy', productId), {
        method: 'delete',
        preserveScroll: true,
        onSuccess: (response) => {
            if (response.props.cart) {
                setCartProducts(response.props.cart);
            }

            toast({
                title: "Producto eliminado",
                description: "El producto fue eliminado del carrito.",
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo eliminar el producto.",
                variant: "destructive",
            });
        },
    });
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
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartProducts.map((product) => (
                    <li key={product.id} className="flex flex-col md:flex-row items-center gap-6 py-6 relative group">
                        <button
                            onClick={() => setConfirmProductId(product.id)}
                            className="absolute top-3 left-3 text-gray-400 hover:text-red-600 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-10 transition-all duration-200 hover:scale-110"
                            aria-label="Eliminar producto"
                        >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>

                        {confirmProductId === product.id && (
                            <Confirm
                                title={`Eliminar "${product.name}"`}
                                message="¿Estás seguro de eliminar este producto?"
                                onConfirm={() => handleRemoveProduct(product.id)}
                                onCancel={handleCancelRemove}
                            />
                        )}

                        <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                            {product.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={() => goToPrevImage(product.id)} 
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 rounded-full hover:bg-black/50 transition-all duration-200"
                                        aria-label="Imagen anterior"
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
                                    </button>
                                    <button 
                                        onClick={() => goToNextImage(product.id)} 
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 rounded-full hover:bg-black/50 transition-all duration-200"
                                        aria-label="Siguiente imagen"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
                                    </button>
                                </>
                            )}
                            <img
                                src={product.images.length > 0 ? product.images[imageIndexes[product.id]].full_url : null}
                                alt={product.name}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{product.description}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                <span className="bg-gray-800 dark:bg-gray-600 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
                                    <FontAwesomeIcon icon={faTshirt} className="mr-1.5 w-3 h-3" />
                                    {product.size}
                                </span>
                                <span className="bg-gray-800 dark:bg-gray-600 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
                                    <FontAwesomeIcon icon={faPalette} className="mr-1.5 w-3 h-3" />
                                    {product.color}
                                </span>
                                <span className="bg-gray-800 dark:bg-gray-600 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
                                    <FontAwesomeIcon icon={faTag} className="mr-1.5 w-3 h-3" />
                                    ${product.price}
                                </span>
                                <span className="bg-green-600 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5 w-3 h-3" />
                                    Stock: {product.stock}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-3">
                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                ${(product.price * product.pivot.quantity).toFixed(2)}
                                <span className="text-sm text-gray-500 dark:text-gray-300 ml-1">({product.pivot.quantity} un.)</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleQuantityChangeLocal(product.id, Math.max(product.pivot.quantity - 1, 1))}
                                    disabled={product.pivot.quantity <= 1}
                                    className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                                    aria-label="Reducir cantidad"
                                >
                                    <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                                </button>

                                {editingProductId === product.id ? (
                                    <input
                                        type="text"
                                        value={inputQuantity}
                                        onChange={(e) => handleQuantityInputChange(e, product.id)}
                                        onBlur={() => handleQuantityInputBlur(product.id)}
                                        onKeyDown={(e) => handleQuantityInputKeyDown(e, product.id)}
                                        className="w-16 text-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                ) : (
                                    <div
                                        onClick={() => {
                                            setEditingProductId(product.id);
                                            setInputQuantity(product.pivot.quantity.toString());
                                        }}
                                        className="w-16 text-center border border-transparent hover:border-gray-300 dark:hover:border-gray-500 dark:text-white rounded-md py-1 px-2 cursor-text"
                                    >
                                        {product.pivot.quantity}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleQuantityChangeLocal(product.id, Math.min(product.pivot.quantity + 1, product.stock))}
                                    disabled={product.pivot.quantity >= product.stock}
                                    className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                                    aria-label="Aumentar cantidad"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {cartProducts.length > 0 && (
                <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <FontAwesomeIcon icon={faReceipt} className="mr-2 text-gray-600 dark:text-gray-300" />
                        Resumen del pedido
                    </h3>

                    <div className="space-y-3 mb-5">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                            <span className="font-medium text-gray-800 dark:text-white">${totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300 flex items-center">
                                <FontAwesomeIcon icon={faTruck} className="mr-1.5 w-3 h-3" />
                                Envío
                            </span>
                            <span className="font-medium text-gray-800 dark:text-white">${totals.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-500">
                            <span className="font-semibold dark:text-white">Total</span>
                            <span className="font-bold text-lg text-gray-800 dark:text-white">${totals.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={route('dashboard')}
                            className="flex-1 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-center font-medium flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Seguir Comprando
                        </Link>
                        <button
                            className={`flex-1 px-5 py-2.5 text-white rounded-lg text-center font-medium transition duration-200 flex items-center justify-center ${
                                isCartEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            }`}
                            onClick={onConfirmCheckout}
                        >
                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                            Proceder al Pago
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
