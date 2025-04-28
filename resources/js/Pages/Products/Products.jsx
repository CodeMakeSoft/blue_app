import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faShoppingCart, 
    faEye, 
    faTags, 
    faStar,
    faBox,
    faSearch,
    faFilter
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Breadcrumb from "@/Components/Breadcrumb";

export default function View({ products = [] }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [likes, setLikes] = useState({});
    const [cartState, setCartState] = useState({});
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

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

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
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
                <div>
                    <Breadcrumb
                    routes={[
                        { name: "Dashboard", link: route("dashboard") },
                        { name: "Productos", link: route("products.view") },
                    ]}
                    currentPage="Lista de Productos"
                    />
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faBox} className="text-blue-600" />
                        Menú de Productos
                    </h2>
                </div>
                
            }
        >

            <Head title="Menú de Productos" />

            <div className="">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            {/* Barra de búsqueda */}
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>

                            {/* Botón de filtros */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faFilter} />
                                Filtros
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 relative"
                            >
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                        onClick={() => handleImageClick(product)}
                                    />
                                    {/* Badge de precio */}
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                            <FontAwesomeIcon icon={faTags} className="text-yellow-300" />
                                            ${product.price}
                                        </span>
                                    </div>
                                    {/* Botón de carrito */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={cartState[product.id]}
                                        className={`absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full group transition-all duration-200 hover:scale-110 ${
                                            cartState[product.id]
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-blue-600"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faShoppingCart}
                                            className={`text-xl ${
                                                cartState[product.id]
                                                    ? "text-gray-400"
                                                    : "text-gray-700 dark:text-gray-300 group-hover:text-white"
                                            }`}
                                        />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleImageClick(product)}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                            Ver detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
