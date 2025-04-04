import { useState } from "react";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function ConfirmEdit({ item, onConfirm }) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        console.log("Item recibido en ConfirmEdit:", item);
        if (!item) {
            console.error("Error: Item inválido");
            return;
        }
        onConfirm(item); // Llamamos a `onConfirm` con el ítem seleccionado
        setOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
            >
                <PencilIcon className="h-5 w-5 mr-2" />
                Editar
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow p-6 transition-all relative"
                    >
                        <button
                         onClick={() => setOpen(false)}
                            className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                       
                        <p className="mb-4 text-gray-700">¿Quieres realizar cambios?</p>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleConfirm}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
