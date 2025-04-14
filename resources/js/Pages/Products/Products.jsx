import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function View({ products = [] }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [likes, setLikes] = useState({});
    const [cartState, setCartState] = useState({});

    const handleImageClick = (product) => {
        console.log("Clic en producto:", product.id);
        router.get(`/products/${product.id}`);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const handleLike = (id) => {
        setLikes((prevLikes) => {
            if (prevLikes[id]) return prevLikes; // Si ya hay "me gusta", no hacer nada
            return {
                ...prevLikes,
                [id]: 1, // Establece el "me gusta" en 1
            };
        });
    };

    const handleAddToCart = (product) => {
        console.log("Producto agregado al carrito:", product);
        // Lógica para agregar el producto al carrito
        axios
            .get(route("cart.add", product.id))  // Aquí debes tener la ruta de agregar al carrito
            .then(() => {
                setCartState((prev) => ({ ...prev, [product.id]: true }));
            })
            .catch((error) => {
                console.error("Error al agregar al carrito:", error);
            });
    };

    useEffect(() => {
        // Verificar si el producto ya está en el carrito al cargar la página
        products.forEach((product) => {
            axios
                .get(route("cart.contains", product.id))
                .then((res) => {
                    setCartState((prevState) => ({
                        ...prevState,
                        [product.id]: res.data.inCart,
                    }));
                })
                .catch((error) => {
                    console.error("Error al verificar carrito:", error);
                });
        });
    }, [products]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Menú de Productos
                </h2>
            }
        >
            <Head title="Menú de Productos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 relative"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onClick={() => handleImageClick(product)}
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        ${product.price}
                                    </p>
                                </div>

                                {/* Botón de carrito en la esquina superior derecha */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={cartState[product.id]}
                                    className={`absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full group transition-colors duration-200 ${
                                        cartState[product.id]
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    }`}
                                >
                                    <FontAwesomeIcon
                                        icon={faShoppingCart}
                                        className={`text-xl text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-950 transition-colors duration-200`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
