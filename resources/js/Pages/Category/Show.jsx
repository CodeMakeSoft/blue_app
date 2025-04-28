import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Show({ auth, category }) {
    return (
        <AuthenticatedLayout user={auth.user} header={
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
        }>

            <div className="py-6 px-3 sm:px-6 lg:px-8">
                {/* Contenedor principal */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row gap-8">
                        {/* Información de la Categoría (40%) */}
                        <div className="md:w-2/5 flex flex-col justify-center">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-8">
                                    {category.description}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Link
                                        href={route("category.edit", {
                                            category: category.id,
                                        })}
                                        className="inline-block bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-md transition"
                                    >
                                        Editar Categoría
                                    </Link>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium px-6 py-2 border border-blue-200 dark:border-blue-700 rounded-md transition"
                                    >
                                        Ver productos →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Contenedor de Imagen (60%) */}
                        <div className="md:w-3/5">
                            <div className="bg-white dark:bg-gray-800 h-full flex items-center justify-center">
                                {category.image ? (
                                    <div className="relative w-full">
                                        <img
                                            src={`/storage/${category.image.url}`}
                                            alt={`Imagen de ${category.name}`}
                                            className="w-full h-auto max-h-96 object-contain mx-auto"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/placeholder.jpg";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-12 w-full bg-gray-50 dark:bg-gray-700 rounded">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No hay imagen disponible
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
