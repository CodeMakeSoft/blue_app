import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Toaster, toast } from "sonner";
import ConfirmDelete from "@/Components/ConfirmDelete";


export default function Index({ locations }) {
    const handleDelete = (id) => {
        router.delete(`/address/${id}`, {
            onSuccess: () => {
                toast.success("Dirección eliminada exitosamente");
            },
            onError: () => {
                toast.error("Error al eliminar la dirección");
            },
        });
    };

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
                        href={route("address.create")}
                        className="flex flex-col items-center p-5 bg-white border-4 border-gray-200 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <PlusIcon className="h-8 w-8 text-gray-700" />
                        <h2 className="mt-2 text-lg font-semibold text-gray-900">
                            Agregar Dirección
                        </h2>
                    </Link>
                </div>
                <div className="space-y-4">
                    {locations.length > 0 ? (
                        locations.map((location) => (
                            <div
                                key={location.id}
                                className="bg-white p-6 rounded-lg shadow border border-gray-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {location.alias}
                                        </h3>
                                        <p className="text-gray-600">
                                            {location.street} #
                                            {location.ext_number}
                                            {location.int_number &&
                                                ` Int. ${location.int_number}`}
                                        </p>
                                        <p className="text-gray-600">
                                            {
                                                location.district?.city
                                                    ?.municipality?.state?.name
                                            }
                                            ,{" "}
                                            {
                                                location.district?.city
                                                    ?.municipality?.state
                                                    ?.country?.name
                                            }
                                        </p>

                                        <p className="text-gray-600">
                                            {location.district?.name},{" "}
                                            {location.district?.city?.name}
                                        </p>
                                        <p className="text-gray-600">
                                            Código Postal:{" "}
                                            {location.district?.postal_code}
                                        </p>
                                        {location.phone && (
                                            <p className="text-gray-600">
                                                Tel: {location.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route(
                                                "address.edit",
                                                location.id
                                            )}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </Link>
                                        <ConfirmDelete
                                            id={location.id}
                                            onConfirm={handleDelete}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        />
                                    </div>
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
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg shadow">
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
