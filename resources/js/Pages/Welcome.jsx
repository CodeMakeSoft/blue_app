import { Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
import Footer from '@/Components/Footer';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';

export default function Welcome({ auth, products, brands, categories }) {
    const productRef = useRef(null);
    const brandRef = useRef(null);
    const categoryRef = useRef(null);

    const scroll = (ref, direction) => {
        if (!ref.current) return;
        const scrollAmount = 300;
        ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-100 text-black dark:bg-zinc-900 dark:text-white relative min-h-screen flex flex-col">
                <div className="flex-grow px-4 mb-[4rem]    ">
                    {/* Header */}
                    <header className="flex justify-between items-center py-6 px-4 max-w-7xl mx-auto">
                        <ApplicationLogo className="h-16 w-auto dark:invert transition-all duration-300" />
                        <div>
                            {auth.user ? (
                                <Link href={route('dashboard')} className="text-md text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-md text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="ml-4 text-md text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </header>

                    <main className="space-y-16 max-w-7xl mx-auto text-center">
                        {/* Productos */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Productos</h2>
                            <div className="relative">
                                <button onClick={() => scroll(productRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-zinc-800 shadow rounded-full">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <div ref={productRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-10">
                                    {products.map(product => (
                                        <div key={product.id} className="flex-shrink-0 w-64 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md text-left">
                                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
                                            <h3 className="text-lg font-semibold">{product.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                                            <p className="mt-2 font-bold">${product.price}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => scroll(productRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-zinc-800 shadow rounded-full">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </section>

                        {/* Marcas destacadas */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Marcas destacadas <FontAwesomeIcon icon={faStar} className="text-yellow-400" /></h2>
                            <div className="relative flex justify-center">
                                <button onClick={() => scroll(brandRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-zinc-800 shadow rounded-full">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <div ref={brandRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-10 justify-center">
                                    {brands.slice(0, 5).map(brand => (
                                        <div key={brand.id} className="flex-shrink-0 w-32 flex flex-col items-center">
                                            <img src={brand.image} alt={brand.name} className="w-20 h-20 object-contain" />
                                            <p className="mt-2">{brand.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => scroll(brandRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-zinc-800 shadow rounded-full">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </section>

                        {/* Categorías destacadas */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Categorías destacadas <FontAwesomeIcon icon={faStar} className="text-yellow-400" /></h2>
                            <div className="relative flex justify-center">
                                <button onClick={() => scroll(categoryRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-zinc-800 shadow rounded-full">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <div ref={categoryRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-10 justify-center">
                                    {categories.slice(0, 5).map(category => (
                                        <div key={category.id} className="flex-shrink-0 w-32 flex flex-col items-center">
                                            <img src={category.image} alt={category.name} className="w-20 h-20 object-contain" />
                                            <p className="mt-2">{category.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => scroll(categoryRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-zinc-800 shadow rounded-full">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </section>
                    </main>
                </div>

                <Footer />
            </div>
        </>
    );
}
