import { useState } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function ConfirmDelete({ id, onConfirm }) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        if (!id) {
            console.error("Error: Invalid ID");
            return;
        }
        onConfirm(id);
        setOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center border border-gray-500 bg-white text-gray-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete
            </button>

            {open && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex flex-col items-center mb-6">
                            <TrashIcon className="h-12 w-12 text-gray-500 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
