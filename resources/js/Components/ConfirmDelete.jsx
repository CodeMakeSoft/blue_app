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
                className="flex items-center border border-gray-500 dark:border-gray-400 
                    bg-white dark:bg-gray-700 
                    text-gray-600 dark:text-gray-300 
                    px-3 py-1 rounded 
                    hover:bg-gray-100 dark:hover:bg-gray-600 
                    transition-colors duration-200"
            >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete
            </button>

            {open && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/20 dark:bg-black/40 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center mb-6">
                            <TrashIcon className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                Confirm Delete
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-center">
                                Are you sure you want to delete this item?
                            </p>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="bg-gray-300 dark:bg-gray-700 
                                    text-gray-800 dark:text-gray-200 
                                    px-6 py-2 rounded-md 
                                    hover:bg-gray-400 dark:hover:bg-gray-600 
                                    transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="bg-red-600 dark:bg-red-500 
                                    text-white px-6 py-2 rounded-md 
                                    hover:bg-red-700 dark:hover:bg-red-600 
                                    transition-colors duration-200"
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
