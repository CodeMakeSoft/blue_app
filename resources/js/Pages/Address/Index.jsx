import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Toaster, toast } from "sonner";
import ConfirmDelete from "@/Components/ConfirmDelete";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Index({ locations }) {
    const handleDelete = (id) => {
        router.delete(`/address/${id}`, {
            onSuccess: () => {
                console.log("Eliminado correctamente");
                toast.success("Dirección eliminada correctamente");
                router.visit();
            },
            onError: () => {
                toast.error("Error al eliminar la dirección");
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("home") },
                            { name: "Catálogo de Marcas", link: route("catalog") },
                        ]}
                        currentPage="Catálogo de Marcas"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Catálogo de Marcas
                    </h2>
                </div>
            }
        >
            <Head title="Direcciones" />
            <Toaster position="top-right" richColors />
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route("address.create")}
                        className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <PlusIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                        <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Agregar Dirección
                        </h2>
                    </Link>
                </div>

                {/* Contenedor grid responsivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {locations.length > 0 ? (
                        locations.map((location) => (
                            <div
                                key={location.id}
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col h-full"
                            >
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg mb-2 dark:text-gray-100">
                                        {location.alias}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {location.street} #{location.ext_number}
                                        {location.int_number &&
                                            ` Int. ${location.int_number}`}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                        {
                                            location.district?.city
                                                ?.municipality?.state?.name
                                        }
                                        ,{" "}
                                        {
                                            location.district?.city
                                                ?.municipality?.state?.country
                                                ?.name
                                        }
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {location.district?.name},{" "}
                                        {location.district?.city?.name}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        C.P. {location.district?.postal_code}
                                    </p>
                                    {location.phone && (
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Tel: {location.phone}
                                        </p>
                                    )}
                                </div>
                                {location.delivery_instructions && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-medium">
                                                Instrucciones:
                                            </span>{" "}
                                            {location.delivery_instructions}
                                        </p>
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 mt-4">
                                    <Link
                                        href={route(
                                            "address.edit",
                                            location.id
                                        )}
                                        className="flex items-center border border-gray-500 dark:border-gray-400 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                                        Edit
                                    </Link>
                                    <ConfirmDelete
                                        id={location.id}
                                        onConfirm={handleDelete}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <p className="text-gray-500 dark:text-gray-400">
                                No tienes direcciones registradas
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
