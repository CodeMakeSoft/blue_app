import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    MagnifyingGlassIcon,
    MapPinIcon,
} from "@heroicons/react/24/solid";

export default function Account() {
    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Mi cuenta
                </h1>
            }
        >
            <Head title="Account" />

            <div className="mb-8"></div>

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                {" "}
                {/* Contenedor con padding izquierdo */}
                <div className="grid grid-cols-1 w-fit gap-4">
                    {/* Botón Mis pedidos */}
                    <Link
                        href={route("admin.panel")}
                        className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-700 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Mis pedidos
                            </h2>
                            <p className="text-sm text-gray-600">
                                Rastrear paquetes, devolver pedidos o comprar
                                algo de nuevo
                            </p>
                        </div>
                    </Link>

                    {/* Botón Direcciones */}
                    <Link
                        href={route("admin.panel")}
                        className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <MapPinIcon className="h-6 w-6 text-gray-700 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Direcciones
                            </h2>
                            <p className="text-sm text-gray-600">
                                Editar direcciones para pedidos y regalos
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}