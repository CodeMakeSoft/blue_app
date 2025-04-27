import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Confirm from '@/Components/Confirm';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faSignInAlt, faUserPlus, faEye } from '@fortawesome/free-solid-svg-icons';

export default function Welcome({ auth, products, brands, categories }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

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

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-white dark:bg-black text-gray-800 dark:text-white min-h-screen transition-colors duration-500">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4">
    <div className="flex items-center space-x-4">
        <ApplicationLogo className="h-12 w-auto dark:invert transition duration-500" />
        <span className="text-2xl font-semibold text-gray-800 dark:text-white">UPP Store</span>
    </div>
    <div className="flex space-x-4">
        {auth.user ? (
            <Link
                href={route('dashboard')}
                className="text-sm text-gray-800 dark:text-gray-200 hover:text-blue-500 transition duration-300 font-medium py-2 px-4 rounded-lg border border-transparent hover:border-blue-500 flex items-center space-x-2"
            >
                <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />
                <span>Dashboard</span>
            </Link>
        ) : (
            <>
                <Link
                    href={route('login')}
                    className="text-sm text-gray-800 dark:text-gray-200 hover:text-blue-500 transition duration-300 font-medium py-2 px-4 rounded-lg border border-transparent hover:border-blue-500 flex items-center space-x-2"
                >
                    <FontAwesomeIcon icon={faSignInAlt} className="text-lg" />
                    <span>Log in</span>
                </Link>
                <Link
                    href={route('register')}
                    className="text-sm text-gray-800 dark:text-gray-200 hover:text-blue-500 transition duration-300 font-medium py-2 px-4 rounded-lg border border-transparent hover:border-blue-500 flex items-center space-x-2"
                >
                    <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                    <span>Register</span>
                </Link>
            </>
        )}
    </div>
</header>


                <main className="max-w-7xl mx-auto px-4 py-10 space-y-20">
                    {/* Productos */}
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-6">Productos</h2>
                        <div className="relative">
                            <div className="flex overflow-x-auto space-x-6 pb-4">
                                {products.map((product) => (
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
                                {brands.slice(0, 5).map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition p-4 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 relative overflow-hidden transform hover:scale-105 cursor-pointer"
                                    >
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative group w-24 h-24">
                                                <img src={brand.image_url} alt={brand.name} className="w-full h-full object-contain" />
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
                                {categories.slice(0, 5).map((category) => (
                                    <div
                                        key={category.id}
                                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition p-4 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 relative overflow-hidden transform hover:scale-105 cursor-pointer"
                                    >
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative group w-24 h-24">
                                                <img src={category.image_url} alt={category.name} className="w-full h-full object-contain" />
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

                <Footer />
            </div>

            {/* Modal */}
            {showConfirm && (
                <Confirm
                    title="Inicia sesión"
                    message={`Debes iniciar sesión para ver este ${selectedType}.`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
}
