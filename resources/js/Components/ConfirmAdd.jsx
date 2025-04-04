import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import {PlusCircleIcon,} from "@heroicons/react/24/solid";
export default function ConfirmAdd({ onConfirm, label }) {
    const [open, setOpen] = useState(false);

    return (
        <>
           <button
           onClick={() => setOpen(true)}
             className="flex items-center border border-gray-600 bg-white text-gray-600 rounded px-4 py-2 text-base hover:bg-gray-100 transition"
           >
          <PlusCircleIcon className="h-6 w-6 mr-2" />
              {label || "Agregar"}
            </button>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow p-6 transition-all relative w-[350px] max-w-full"
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        <p className="mb-4 text-gray-700">
                            ¿Quieres agregar un nuevo registro?
                        </p>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="border border-gray-400 bg-white text-gray-600 px-4 py-2 rounded hover:bg-gray-100 transition"

                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onConfirm();
                                }}
                                className="border border-gray-400 bg-white text-gray-600 px-4 py-2 rounded hover:bg-gray-100 transition"

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
