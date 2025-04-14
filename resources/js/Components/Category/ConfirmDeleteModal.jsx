import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function ConfirmDeleteModal({ category, onClose, onConfirm }) {
    const [isDeleted, setIsDeleted] = useState(false);

    const handleConfirm = () => {
        onConfirm();
        setIsDeleted(true);

        setTimeout(() => {
            onClose();
            setIsDeleted(false);
        }, 2000);
    };

    if (!category) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                {isDeleted ? (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                            Categoría eliminada con éxito
                        </h3>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <TrashIcon className="w-20 h-20 mx-auto text-gray-500 dark:text-gray-400 mb-2" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Confirmar Eliminación
                            </h3>
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                            ¿Estás seguro de que deseas eliminar la categoría{" "}
                            <strong>{category.name}</strong>?
                        </p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
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
