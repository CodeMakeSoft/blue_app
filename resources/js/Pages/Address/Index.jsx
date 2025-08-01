import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Toaster, toast } from "sonner";
import ConfirmDelete from "@/Components/ConfirmDelete";
import Breadcrumb from "@/Components/Breadcrumb";
import AddressCard from "@/Components/Address/AddressCard";

export default function Index({ locations }) {
    const handleDelete = (id) => {
         router.delete(route("address.destroy", id), {
             onSuccess: () => {
                 toast.success("Dirección eliminada correctamente");
             },
             onError: () => {
                 toast.error("Error al eliminar la dirección");
             },
         });
    };

    const handleSetDefault = (id) => {
         router.post(route("address.set-default", id), {
             onSuccess: () => {
                 toast.success("Dirección predeterminada actualizada");
             },
             onError: () => {
                 toast.error("Error al actualizar la dirección predeterminada");
             },
         });
    };

    console.log("Locations data:", locations);
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            { name: "Mi Cuenta", link: route("account") },
                        ]}
                        currentPage="Mis Direcciones"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Mis Direcciones
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
                            <AddressCard
                                key={location.id}
                                location={location}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
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