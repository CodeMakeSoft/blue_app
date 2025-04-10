// resources/js/Pages/Location/Index.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Index({ locations }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Mis direcciones
                </h2>
            }
        >
            <Head title="Direcciones" />

            <div className="py-8 px-4 max-w-7xl mx-auto">
                <div className="mb-4">
                    <Link
                        href={route("admin.panel")}
                        className="flex flex-col items-center p-5 bg-white border-4 border-gray-200 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <PlusIcon className="h-8 w-8 text-gray-700" />
                        <h2 className="mt-2 text-lg font-semibold text-gray-900">
                            Agregar Dirección
                        </h2>
                    </Link>
                </div>

    
            </div>
        </AuthenticatedLayout>
    );
}
