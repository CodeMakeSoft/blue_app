import React, { useState } from "react";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
}) {
    const [clickedButton, setClickedButton] = useState(null);

    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "all") {
            setItemsPerPage(totalItems);
            onPageChange(1);
        } else {
            setItemsPerPage(Number(value));
            onPageChange(1);
        }
    };

    const handlePageClick = (page) => {
        setClickedButton(page);
        onPageChange(page);
        setTimeout(() => {
            setClickedButton(null);
        }, 300);
    };

    const computedTotalPages =
        itemsPerPage >= totalItems &&
        itemsPerPage !== 5 &&
        itemsPerPage !== 15 &&
        itemsPerPage !== 50
            ? 1
            : Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex justify-between items-center mt-4 w-full">
            {/* Select de "Mostrar" a la izquierda */}
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium dark:text-gray-200">
                    Mostrar:
                </label>
                <select
                    className="border rounded px-3 py-1 text-center w-20 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={itemsPerPage === totalItems ? "all" : itemsPerPage}
                    onChange={handleSelectChange}
                >
                    <option value={5}>5</option>
                    <option value={15}>15</option>
                    <option value={50}>50</option>
                    <option value="all">Todos</option>
                </select>
            </div>

            {/* Botones de paginación alineados a la derecha */}
            {itemsPerPage !== totalItems && computedTotalPages > 1 && (
                <div className="flex space-x-3 ml-auto">
                    <button
                        className={`px-4 py-2 border rounded transition ${
                            currentPage === 1
                                ? "opacity-50 cursor-not-allowed dark:opacity-50"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white"
                        }`}
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>

                    {[...Array(computedTotalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isSelected = currentPage === pageNumber;
                        const isClicked = clickedButton === pageNumber;

                        return (
                            <button
                                key={index}
                                className={`px-4 py-2 border rounded transition ${
                                    isSelected
                                        ? "bg-gray-800 text-white border-gray-800 dark:bg-blue-600 dark:border-blue-600"
                                        : isClicked
                                        ? "border-blue-800 dark:border-blue-400"
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white"
                                }`}
                                onClick={() => handlePageClick(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        className={`px-4 py-2 border rounded transition ${
                            currentPage === computedTotalPages
                                ? "opacity-50 cursor-not-allowed dark:opacity-50"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white"
                        }`}
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === computedTotalPages}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
