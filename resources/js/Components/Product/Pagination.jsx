import React, { useState } from "react";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    setItemsPerPage,
}) {
    const [inputValue, setInputValue] = useState(itemsPerPage);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        const parsedValue = Number(value);
        if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue <= 50) {
            setItemsPerPage(parsedValue);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            {/* Selector de cantidad de registros por página */}
            <div className="flex items-center space-x-2"></div>

            {/* Controles de paginación */}
            <div className="flex items-center space-x-1">
                <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md transition-all duration-200 ${
                        currentPage === 1
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-95 active:bg-gray-200 dark:active:bg-gray-600`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border rounded-md transition-all duration-200 mx-1 ${
                            currentPage === index + 1
                                ? "bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700 shadow-inner"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-95 active:bg-blue-500 dark:active:bg-blue-600`}
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md transition-all duration-200 ${
                        currentPage === totalPages
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-95 active:bg-gray-200 dark:active:bg-gray-600`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
