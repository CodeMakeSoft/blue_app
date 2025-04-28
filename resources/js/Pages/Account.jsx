import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    MagnifyingGlassIcon,
    MapPinIcon,
} from "@heroicons/react/24/solid";
import Breadcrumb from "@/Components/Breadcrumb";
import { route } from "ziggy-js";

export default function Account() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Dashboard", link: route("dashboard") },
                        ]}
                        currentPage="Mi cuenta"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-2">
                        Mi cuenta
                    </h1>
                </div>
            }
        >
            <Head title="Account" />

            <div className="mb-8"></div>

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 w-fit gap-4">
                    {/* Botón Mis pedidos */}
                    <Link
                        href={route("purchases.index")}
                        className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Mis pedidos
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Rastrear paquetes, devolver pedidos o comprar
                                algo de nuevo
                            </p>
                        </div>
                    </Link>

                    {/* Botón Direcciones */}
                    <Link
                        href={route("address.index")}
                        className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                        <MapPinIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Direcciones
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Editar direcciones para pedidos y regalos
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
