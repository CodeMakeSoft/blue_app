import { useState } from "react";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

export default function ConfirmAdd({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 dark:bg-black/40 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <PlusCircleIcon className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Confirm Create
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                        Are you sure you want to create this new item?
                    </p>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 dark:bg-gray-700 
                            text-gray-800 dark:text-gray-200 
                            px-6 py-2 rounded-md 
                            hover:bg-gray-400 dark:hover:bg-gray-600 
                            transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-600 dark:bg-blue-500 
                            text-white px-6 py-2 rounded-md 
                            hover:bg-blue-700 dark:hover:bg-blue-600 
                            transition-colors duration-200"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
