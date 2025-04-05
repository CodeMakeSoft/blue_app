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
        <div className="flex justify-between items-center mt-4">
            {/* Selector de cantidad de registros por página */}
            <div className="flex items-center space-x-2"></div>

            {/* Controles de paginación */}
            <div className="flex space-x-2">
                <button
                    className={`px-4 py-2 border rounded ${
                        currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-400"
                    }`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 border rounded ${
                            currentPage === index + 1
                                ? "bg-blue-500 text-white"
                                : "hover:bg-blue-400"
                        }`}
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    className={`px-4 py-2 border rounded ${
                        currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-400"
                    }`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
