import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Confirm from '@/Components/Confirm';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEye, 
    faSearch, 
    faShoppingCart,
    faShoppingBag,
    faTags,
    faStar,
    faLayerGroup,
    faTrademark,
    faBoxes,
    faFilter
} from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Asegúrate de importar el layout
import Breadcrumb from '@/Components/Breadcrumb';
import axios from 'axios';

export default function Dashboard({ auth, products, brands, categories, filters }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [cartState, setCartState] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [searchResults, setSearchResults] = useState({
        products: [],
        brands: [],
        categories: []
    });

    const handleItemClick = (type, e) => {
        if (e) e.stopPropagation();
        setSelectedType(type);
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        window.location.href = route('login');
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setSelectedType(null);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            setSearchResults({
                products: products.data,
                brands: brands.data,
                categories: categories.data
            });
            return;
        }

        const searchLower = search.toLowerCase();

        // Filtrar productos por nombre o descripción
        const filteredProducts = products.data.filter(product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower)
        );

        // Obtener IDs únicos de marcas y categorías de los productos filtrados
        const relatedBrandIds = new Set(filteredProducts.map(p => p.brand_id));
        const relatedCategoryIds = new Set(filteredProducts.map(p => p.category_id));

        // Filtrar marcas relacionadas
        const filteredBrands = brands.data.filter(brand => 
            brand.name.toLowerCase().includes(searchLower) ||
            relatedBrandIds.has(brand.id)
        );

        // Filtrar categorías relacionadas
        const filteredCategories = categories.data.filter(category => 
            category.name.toLowerCase().includes(searchLower) ||
            relatedCategoryIds.has(category.id)
        );

        // Debug: verificar los resultados
        console.log('Productos filtrados:', filteredProducts);
        console.log('Marcas relacionadas:', filteredBrands);
        console.log('Categorías relacionadas:', filteredCategories);

        setSearchResults({
            products: filteredProducts,
            brands: filteredBrands,
            categories: filteredCategories
        });
    };

    const handleClearSearch = () => {
        setSearch('');
        setSearchResults({
            products: products.data,
            brands: brands.data,
            categories: categories.data
        });
        router.get(route('dashboard'));
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

    const handleImageClick = (product) => {
        console.log("Clic en producto:", product.id);
        router.get(`/products/${product.id}`);
    };

    const handleCategoryClick = (category) => {
        router.get(route('categories.products', category.id));
    };

    const handleBrandClick = (brand) => {
        router.get(route('brands.products', brand.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Head title="Dashboard" />
                    <Breadcrumb
                        routes={[
                            { name: "Dashboard", link: route("dashboard") },
                        ]}
                        currentPage="Explorar"
                    />
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faBoxes} className="text-blue-600" />
                        {'Productos, Marcas y Categorías'}
                    </h2>
                </div>
            }
        >
            <div>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Barra de búsqueda */}
                    <form onSubmit={handleSearchSubmit} className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Buscar productos, marcas o categorías..."
                                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faSearch} />
                                    Buscar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                    Filtros
                                </button>
                            </div>
                        </div>
                    </form>

                    {search && (
                        <div className="mb-4 text-gray-600 dark:text-gray-400">
                            Mostrando resultados para: <span className="font-semibold">{search}</span>
                            <button
                                onClick={handleClearSearch}
                                className="ml-2 text-blue-600 hover:text-blue-700"
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    )}

                    {/* Productos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {(search ? searchResults.products : products.data).map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 relative"
                            >
                                <div className="relative">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-48 object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                        onClick={() => handleImageClick(product)}
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

                    {/* Marcas */}
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faTrademark} className="text-blue-600" />
                            Marcas {search && `relacionadas con "${search}"`}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {(search ? searchResults.brands : brands.data).map((brand) => (
                                <div
                                    key={brand.id}
                                    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="relative group">
                                        <div className="w-full h-32 flex items-center justify-center">
                                            <img
                                                src={brand.image_url}
                                                alt={brand.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                                        <button
                                            onClick={() => handleBrandClick(brand)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transform hover:scale-110 transition-all"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        </div>
                                    </div>
                                    <h3 className="text-center mt-4 font-semibold text-gray-900 dark:text-gray-100">
                                        {brand.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Categorías */}
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600" />
                            Categorías {search && `relacionadas con "${search}"`}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {(search ? searchResults.categories : categories.data).map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="relative group">
                                        <div className="w-full h-32 flex items-center justify-center">
                                            <img
                                                src={category.image_url}
                                                alt={category.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                                            <button
                                                onClick={() => handleCategoryClick(category)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transform hover:scale-110 transition-all"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-center mt-4 font-semibold text-gray-900 dark:text-gray-100">
                                        {category.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal */}
            {showConfirm && (
                <Confirm
                    isOpen={showConfirm}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                    title={`¿Deseas iniciar sesión para ver la ${selectedType}?`}
                    message="Para continuar, debes iniciar sesión."
                />
            )}
        </AuthenticatedLayout>
    );
}
