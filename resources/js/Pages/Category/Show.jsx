import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Show({ auth, category }) {
    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            { name: "Categorías", link: route("category.index") },
                        ]}
                        currentPage={`Detalle de ${category.name}`}
                    />
                    <Head title={`Detalle de ${category.name}`} />
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-2">
                        Detalle de Categoría
                    </h1>
                </>
            }
        >
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Card principal */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <div className="p-8 flex flex-col md:flex-row gap-12">
                            {/* Información de la Categoría */}
                            <div className="md:w-2/5 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                            {category.name}
                                        </h3>
                                        <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                                    </div>
                                    
                                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <Link
                                        href={route('categories.products', { category: category.id })}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                                    >
                                        <span className="font-semibold">Ver productos</span>
                                        <ChevronLeftIcon className="h-5 w-5 rotate-180" />
                                    </Link>
                                </div>
                            </div>

                            {/* Contenedor de Imagen */}
                            <div className="md:w-3/5">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 h-full flex items-center justify-center transition-all duration-300 hover:shadow-inner">
                                    {category.image ? (
                                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                                            <img
                                                src={`/storage/${category.image.url}`}
                                                alt={`Imagen de ${category.name}`}
                                                className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/images/placeholder.jpg";
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                            <svg
                                                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
                                                No hay imagen disponible
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
