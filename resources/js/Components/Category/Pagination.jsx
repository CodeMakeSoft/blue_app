import React, { useState } from "react";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    hideItemsPerPage = false,
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
        setTimeout(() => {
            setClickedButton(null);
            onPageChange(page);
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
        <div className="flex flex-wrap justify-between items-center mt-4 w-full">
            {!hideItemsPerPage && (
                <div className="flex items-center space-x-2 mb-4 sm:mb-0 w-full sm:w-auto">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mostrar:
                    </label>
                    <select
                        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-1 text-center w-full sm:w-32 md:w-40 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={
                            itemsPerPage === totalItems ? "all" : itemsPerPage
                        }
                        onChange={handleSelectChange}
                    >
                        <option value={5}>5</option>
                        <option value={15}>15</option>
                        <option value={50}>50</option>
                        <option value="all">Todos</option>
                    </select>
                </div>
            )}

            {itemsPerPage !== totalItems && computedTotalPages > 1 && (
                <div className="flex flex-wrap justify-center sm:justify-end space-x-2 ml-auto">
                    <button
                        className={`px-4 py-2 border rounded transition-all duration-200 ${
                            currentPage === 1
                                ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                        } ${
                            clickedButton === currentPage - 1
                                ? "!border-blue-800 shadow-[0_0_8px_2px_rgba(30,58,138,0.5)]"
                                : ""
                        } text-gray-700 dark:text-gray-200`}
                        onClick={() =>
                            currentPage !== 1 &&
                            handlePageClick(currentPage - 1)
                        }
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
                                className={`px-4 py-2 border rounded transition-all duration-200 ${
                                    isSelected
                                        ? "bg-blue-800 text-white border-blue-800"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                } ${
                                    isClicked
                                        ? "!border-blue-800 shadow-[0_0_8px_2px_rgba(30,58,138,0.5)]"
                                        : ""
                                }`}
                                onClick={() => handlePageClick(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        className={`px-4 py-2 border rounded transition-all duration-200 ${
                            currentPage === computedTotalPages
                                ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                        } ${
                            clickedButton === currentPage + 1
                                ? "!border-blue-800 shadow-[0_0_8px_2px_rgba(30,58,138,0.5)]"
                                : ""
                        } text-gray-700 dark:text-gray-200`}
                        onClick={() =>
                            currentPage !== computedTotalPages &&
                            handlePageClick(currentPage + 1)
                        }
                        disabled={currentPage === computedTotalPages}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
