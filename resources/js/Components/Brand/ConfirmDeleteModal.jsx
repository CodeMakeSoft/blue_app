import React from "react";

export default function ConfirmDeleteModal({ brand, onClose, onConfirm }) {
    if (!brand) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold text-gray-900">
                    Confirmar Eliminación
                </h3>
                <p className="mt-2 text-gray-700">
                    ¿Estás seguro de que deseas eliminar la categoría{" "}
                    <strong>{brand.name}</strong>?
                </p>
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
