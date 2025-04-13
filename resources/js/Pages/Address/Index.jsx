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
            header={
                <div className="space-y-2">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Mis direcciones
                    </h2>
                    <Breadcrumb />
                </div>
            }
        >
            <Head title="Direcciones" />
            <Toaster position="top-right" richColors />
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route("address.create")}
                        className="flex flex-col items-center p-5 bg-white border-4 border-gray-200 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <PlusIcon className="h-8 w-8 text-gray-700" />
                        <h2 className="mt-2 text-lg font-semibold text-gray-900">
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
                                className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col h-full"
                            >
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg mb-2">
                                        {location.alias}
                                    </h3>
                                    <p className="text-gray-600">
                                        {location.street} #{location.ext_number}
                                        {location.int_number &&
                                            ` Int. ${location.int_number}`}
                                    </p>
                                    <p className="text-gray-600 mt-1">
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
                                    <p className="text-gray-600">
                                        {location.district?.name},{" "}
                                        {location.district?.city?.name}
                                    </p>
                                    <p className="text-gray-600">
                                        C.P. {location.district?.postal_code}
                                    </p>
                                    {location.phone && (
                                        <p className="text-gray-600">
                                            Tel: {location.phone}
                                        </p>
                                    )}
                                </div>
                                {location.delivery_instructions && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-sm text-gray-500">
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
                                        className="flex items-center border border-gray-500 bg-white text-gray-600 px-3 py-1 rounded hover:bg-gray-100 transition"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                                        Edit
                                    </Link>
                                    <ConfirmDelete
                                        id={location.id}
                                        onConfirm={handleDelete}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
                            <p className="text-gray-500">
                                No tienes direcciones registradas
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
