import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function ConfirmDeleteModal({ product, onClose, onConfirm }) {
    const [isDeleted, setIsDeleted] = useState(false);

    const handleConfirm = () => {
        // Llamada para confirmar eliminación
        onConfirm();
        setIsDeleted(true);

        // Cerrar el modal después de 2 segundos para mostrar el mensaje de éxito
        setTimeout(() => {
            onClose();
            setIsDeleted(false); // Resetear el estado para futuras eliminaciones
        }, 3000);
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                {isDeleted ? (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-600">
                            Producto eliminado con éxito
                        </h3>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <TrashIcon className="w-20 h-20 mx-auto text-gray-500 mb-2" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirmar Eliminación
                            </h3>
                        </div>
                        <p className="mt-2 text-gray-700">
                            ¿Estás seguro de que deseas eliminar este Producto{" "}
                            <strong>{product.name}</strong>?
                        </p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
