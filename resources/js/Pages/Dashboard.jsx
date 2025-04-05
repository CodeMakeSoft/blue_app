import { Head } from "@inertiajs/react";

export default function Dashboard({ auth }) {
    // auth viene automáticamente de Inertia
    return (
        <>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h2 className="text-2xl font-bold mb-4">
                                Bienvenido al Panel de Control
                            </h2>

                            {/* Contenido personalizado para el dashboard */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Resumen del Sistema
                                    </h3>
                                    <p>Bienvenido, {auth.user.name}</p>
                                </div>

                                <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Acciones Rápidas
                                    </h3>
                                    <div className="space-y-2">
                                        <a
                                            href={route("products.index")}
                                            className="block text-indigo-600 dark:text-indigo-300 hover:underline"
                                        >
                                            Administrar Productos
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
