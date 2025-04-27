import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Confirm from '@/Components/Confirm';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faSignInAlt, faUserPlus, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Asegúrate de importar el layout
import Breadcrumb from '@/Components/Breadcrumb';

export default function Dashboard({ auth, products, brands, categories, filters }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

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
        window.location.href = `${window.location.pathname}?search=${search}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Dashboard", link: route("dashboard") },
                        ]}
                        currentPage="Explorar"
                    />

                    <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2">
                        {'Productos, Marcas y Categorías'}
                    </h2>
                </div>
            }
        >
            <div className="bg-white dark:bg-black text-gray-800 dark:text-white min-h-screen transition-colors duration-500 flex flex-col">
                <main className="flex-grow w-full px-4 py-10 space-y-20">
                    {/* Barra de búsqueda */}
                    <section>
                        <form onSubmit={handleSearchSubmit} className="flex justify-center mb-6">
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Buscar productos, marcas o categorías..."
                                />
                                <button type="submit" className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Productos */}
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-6">Productos</h2>
                        <div className="relative">
                            <div className="flex overflow-x-auto space-x-6 pb-4">
                                {products.data.map((product) => (
                                    <div
                                        key={product.id}
                                        className="min-w-[250px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-lg overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 transform hover:scale-105 cursor-pointer"
                                    >
                                        <div className="relative">
                                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <button
                                                    onClick={(e) => handleItemClick('producto', e)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110"
                                                    title="Ver producto"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="text-lg" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg">{product.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                                            <p className="mt-2 font-bold text-blue-600 dark:text-blue-400">${product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Marcas Destacadas */}
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-6">Marcas Destacadas</h2>
                        <div className="flex justify-center">
                            <div className="flex overflow-x-auto space-x-6 pb-4">
                                {brands.data.slice(0, 5).map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition p-4 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 relative overflow-hidden transform hover:scale-105 cursor-pointer"
                                    >
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative group w-24 h-24">
                                                <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                                                    <button 
                                                        onClick={(e) => handleItemClick('marca', e)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110"
                                                        title="Ver marca"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium mt-2">{brand.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Categorías Destacadas */}
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-6">Categorías Destacadas</h2>
                        <div className="flex justify-center">
                            <div className="flex overflow-x-auto space-x-6 pb-4">
                                {categories.data.slice(0, 5).map((category) => (
                                    <div
                                        key={category.id}
                                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition p-4 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 relative overflow-hidden transform hover:scale-105 cursor-pointer"
                                    >
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative group w-24 h-24">
                                                <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                                                    <button 
                                                        onClick={(e) => handleItemClick('categoría', e)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110"
                                                        title="Ver categoría"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium mt-2">{category.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
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
