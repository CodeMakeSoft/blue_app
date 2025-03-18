import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React from "react";


export default function ConfirmDelete({ category }) {
    const { delete: deleteCategory } = useForm();

    const handleDelete = () => {
        deleteCategory(route("category.destroy", category.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Confirmar Eliminación
                    </h2>
                </div>
            }
        >
            <Head title="Confirmar Eliminación" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3>
                                ¿Estás seguro de que deseas eliminar esta
                                categoría?
                            </h3>
                            <p>{category.name}</p>

                            <div className="mt-4">
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Eliminar
                                </button>

                                <Link
                                    href={route("category.index")}
                                    className="ml-4 text-blue-500"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
