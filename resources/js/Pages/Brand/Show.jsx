import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Show({ auth, brand }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            { name: "Marcas", link: route("brand.index") },
                        ]}
                        currentPage={`Detalle: ${brand.name}`}
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Detalle de Marca
                    </h2>
                </div>
            }
        >
            <Head title={`Detalle de ${brand.name}`} />

            <div className="py-6 px-3 sm:px-6 lg:px-8">
                {/* Encabezado con botón de volver */}
                <div className="mb-6">
                    <Link
                        href={route("brand.index")}
                        className="inline-flex items-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6 ml-1">
                        Detalle de Marca
                    </h1>
                </div>

                {/* Contenedor principal */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row gap-8">
                        {/* Información de la Marca (40%) */}
                        <div className="md:w-2/5 flex flex-col justify-center">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {brand.name}
                                </h3>
                                <p className="text-gray-600 whitespace-pre-line mb-8">
                                    {brand.description}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Link
                                        href={route("brand.edit", {
                                            brand: brand.id,
                                        })}
                                        className="inline-block bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-md transition"
                                    >
                                        Editar Marca
                                    </Link>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium px-6 py-2 border border-blue-200 rounded-md transition"
                                    >
                                        Ver productos →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Contenedor de Imagen (60%) */}
                        <div className="md:w-3/5">
                            <div className="bg-white h-full flex items-center justify-center">
                                {brand.image ? (
                                    <div className="relative w-full">
                                        <img
                                            src={`/storage/${brand.image.url}`}
                                            alt={`Imagen de ${brand.name}`}
                                            className="w-full h-auto max-h-96 object-contain mx-auto"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/images/placeholder.jpg";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-12 w-full bg-gray-50 rounded">
                                        <p className="text-gray-500">
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
