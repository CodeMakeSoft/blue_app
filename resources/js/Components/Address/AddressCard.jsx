import { Link, router } from "@inertiajs/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import ConfirmDelete from "@/Components/ConfirmDelete";
import { toast } from "sonner";

const AddressCard = ({ location, onSetDefault }) => {
    const formatAddressLine = () => {
        return [
            `${location.street} #${location.ext_number}`,
            location.int_number && `Int. ${location.int_number}`,
            location.location.neighbourhood,
            location.location.city || location.location.municipality,
        ]
            .filter(Boolean)
            .join(", ");
    };

    const formatLocationLine = () => {
        return [
            location.location.municipality,
            location.location.state,
            `C.P. ${location.location.postal_code}`,
        ]
            .filter(Boolean)
            .join(", ");
    };

    const handleSetDefault = (e) => {
        e.preventDefault();
        onSetDefault(location.id);
    };

    const handleDelete = (id) => {
        router.delete(route("address.destroy", id), {
            onSuccess: () => {
                toast.success("Dirección eliminada correctamente");
                router.visit(route("address.index"));
            },
            onError: () => {
                toast.error("Error al eliminar la dirección");
            },
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col h-full relative">
            {/* Badge de dirección predeterminada */}
            {location.is_default && (
                <span className="absolute top-4 right-4 text-xs text-white bg-blue-600 px-2 py-1 rounded">
                    Predeterminada
                </span>
            )}

            {/* Botón para marcar como predeterminada */}
            {!location.is_default && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleSetDefault}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        Marcar como predeterminada
                    </button>
                </div>
            )}

            <div className="flex-grow">
                <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg mb-2 dark:text-gray-100">
                        {location.alias}
                    </h3>
                </div>

                <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {formatAddressLine()}
                </p>

                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {formatLocationLine()}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                    {location.location.country}
                </p>

                {location.phone && (
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        <span className="font-medium">Tel:</span>{" "}
                        {location.phone}
                    </p>
                )}

                {location.references && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium block">
                                Referencias:
                            </span>
                            {location.references}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                    href={route("address.edit", location.id)}
                    className="flex items-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                    Editar
                </Link>

                <ConfirmDelete
                    id={location.id}
                    onConfirm={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                />
            </div>
        </div>
    );
};

export default AddressCard;
