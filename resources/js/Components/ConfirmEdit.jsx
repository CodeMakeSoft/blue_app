import { useState } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function ConfirmEdit({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <PencilSquareIcon className="h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Confirm Edit
                    </h3>
                    <p className="text-gray-600 text-center">
                        Are you sure you want to save these changes?
                    </p>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
