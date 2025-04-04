import { useState } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function ConfirmDelete({ id, onConfirm, can }) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        console.log("ID recibido en ConfirmDelete:", id);
        if (!id) {
            console.error("Error: el ID es inválido");
            return;
        }
        onConfirm(id);
        setOpen(false);
    };

    return (
        <>
            {/* Botón de eliminar - Estilo gris como especificaste */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center border border-gray-500 bg-white text-gray-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
                <TrashIcon className="h-5 w-5 mr-2 text-gray-600" />{" "}
                {/* Asegura color gris */}
                Delete
            </button>

            {/* Modal de confirmación - Manteniendo colores grises */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 flex justify-center items-center bg-black/20"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow p-6 transition-all relative w-[420px] max-w-full"
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            {/* Icono de basura hueco - grande y centrado */}
                            <TrashIcon className="h-16 w-16 text-gray-500 mb-4" />

                            {/* Título y mensaje */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                Confirm Delete
                            </h3>
                            <p className="text-gray-600 text-center">
                                Are you sure you want to delete this item?
                            </p>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
