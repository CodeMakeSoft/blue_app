import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function ConfirmDelete({ id, onConfirm }) {
    const [open, setOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleConfirm = () => {
        if (!id) return;
        onConfirm(id);
        setOpen(false);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    };

    return (
        <>
            {/* Botón para abrir modal */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
            >
                <TrashIcon className="h-5 w-5" />
                Eliminar
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <div className="text-center">
                            <TrashIcon className="w-20 h-20 mx-auto text-gray-500 dark:text-gray-400 mb-2" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Confirmar Eliminación
                            </h3>
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 text-center">
                            ¿Estás segura de que deseas eliminar este producto
                            de tus favoritos?
                        </p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setOpen(false)}
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
                    </div>
                </div>
            )}

            {/* Toast notificación en esquina superior derecha */}
            {showToast && (
                <div
                    className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg
          flex items-center space-x-3 z-50
          animate-fadeIn"
                    role="alert"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span className="font-semibold">
                        Producto eliminado con éxito
                    </span>
                </div>
            )}

            {/* Animación con Tailwind CSS (define esto en tu global css o tailwind config) */}
            <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(-10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
        </>
    );
}
