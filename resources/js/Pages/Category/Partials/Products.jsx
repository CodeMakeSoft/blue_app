import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLayerGroup, 
    faEye, 
    faShoppingCart, 
    faTags 
} from '@fortawesome/free-solid-svg-icons';

export default function CategoryProducts({ auth, category, products }) {
    const [cartState, setCartState] = useState({});
    
    // Handle paginated data from Laravel
    const productsList = products?.data || [];

    const handleAddToCart = (product) => {
        axios.get(route("cart.add", product.id))
            .then(() => {
                setCartState(prev => ({ ...prev, [product.id]: true }));
            })
            .catch(error => console.error("Error al agregar al carrito:", error));
    };

    if (!category || !productsList) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-gray-600 dark:text-gray-400">Cargando...</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            { name: "Categorías", link: route("category.catalog") },
                        ]}
                        currentPage={category.name}
                    />
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 dark:text-blue-500" />
                        {category.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Productos de ${category.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Category Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            {category.description}
                        </p>
                    </div>

                    {/* Products Grid */}
                    {productsList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {productsList.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="relative">
                                    <img
                                        src={product.images && product.images[0] 
                                            ? `/storage/${product.images[0].url}`
                                            : '/images/placeholder.png'} // Asegúrate de tener una imagen placeholder
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                                <FontAwesomeIcon icon={faTags} className="text-yellow-300" />
                                                ${product.price}
                                            </span>
                                        </div>
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
                                            <Link
                                                href={route('products.show', product.id)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                                Ver detalles
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                No hay productos disponibles en esta categoría
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}