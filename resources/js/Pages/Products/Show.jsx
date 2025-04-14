import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import Confirm from "@/Components/Confirm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';

export default function Show({ product }) {
    const [liked, setLiked] = useState(false);
    const [confirmProductId, setConfirmProductId] = useState(null);
    const [inCart, setInCart] = useState(false);
    const [confirmBuy, setConfirmBuy] = useState(false);  // Estado para el modal de confirmación de compra

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
        }
    };

    useEffect(() => {
        axios.get(route("cart.contains", product.id))
            .then((res) => {
                setInCart(res.data.inCart);
            })
            .catch((err) => {
                console.error("Error al verificar si el producto está en el carrito:", err);
            });
    }, [product.id]);

    const handleAddProduct = (productId) => {
        setConfirmProductId(null);

        router.visit(route("cart.add", productId), {
            method: "get",
            preserveScroll: true,
            onSuccess: () => setInCart(true),
            onError: (err) => console.error("Error al agregar al carrito", err),
        });
    };

    const handleBuyNow = (productId) => {
        setConfirmBuy(true);  // Mostrar el modal de confirmación para comprar
    };

    const handleConfirmBuy = (productId) => {
        // Redirigir directamente al checkout con este producto
        router.visit(route("checkout.buy-now", productId), {
            method: "get",
            preserveScroll: true,
        });
        setConfirmBuy(false); // Cerrar el modal después de la compra
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {product.name}
                </h2>
            }
        >
            <Head title={`Detalle - ${product.name}`} />

            <div className="py-12 flex justify-center">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 w-full max-w-5xl transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-80 object-cover rounded-xl shadow-md"
                        />
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {product.name}
                            </h3>

                            <p className="text-2xl text-green-600 dark:text-green-400 mt-3 font-semibold">
                                ${product.price}
                            </p>

                            <p className="text-sm text-gray-500 mb-2">
                                Llega entre <span className="font-medium">3 y 5 días</span>
                            </p>

                            <p className="text-gray-700 dark:text-gray-300 mt-5 leading-relaxed">
                                {product.description}
                            </p>

                            <p className="text-gray-500 dark:text-gray-400 mt-3 italic">
                                Stock disponible: {product.stock}
                            </p>

                            <div className="mt-8 flex gap-4">
                                {/* Me gusta */}
                                <button
                                    onClick={handleLike}
                                    disabled={liked}
                                    className={`p-2 rounded-full border ${
                                        liked
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        size="lg"
                                        color={liked ? "red" : "gray"}
                                    />
                                </button>

                                {/* Agregar al carrito */}
                                <button
                                    disabled={inCart}
                                    onClick={() => setConfirmProductId(product.id)}
                                    className={`${
                                        inCart
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gray-600 hover:bg-gray-700"
                                    } text-white py-2 px-6 rounded-lg shadow transition flex items-center gap-2`}
                                >
                                    <FontAwesomeIcon icon={faCartPlus} />
                                    {inCart ? "Ya en el carrito" : "Agregar al carrito"}
                                </button>

                                {/* Comprar Ahora */}
                                <button
                                    onClick={() => handleBuyNow(product.id)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow transition flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faCreditCard} />
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación para compra */}
            {confirmBuy && (
                <Confirm
                    title="¿Confirmar compra?"
                    message="¿Estás seguro de que deseas proceder con la compra de este producto?"
                    onConfirm={() => handleConfirmBuy(product.id)}
                    onCancel={() => setConfirmBuy(false)}
                />
            )}

            {/* Modal de confirmación de agregar al carrito */}
            {confirmProductId && (
                <Confirm
                    title="¿Agregar al carrito?"
                    message="¿Deseas añadir este producto a tu carrito?"
                    onConfirm={() => handleAddProduct(confirmProductId)}
                    onCancel={() => setConfirmProductId(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}
