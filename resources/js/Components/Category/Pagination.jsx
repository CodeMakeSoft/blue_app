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
        <div className="flex justify-between items-center mt-4 w-full">
            {/* Select de "Mostrar" */}
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                    Mostrar:
                </label>
                <select
                    className="border border-gray-300 rounded px-3 py-1 text-center w-40 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={itemsPerPage === totalItems ? "all" : itemsPerPage}
                    onChange={handleSelectChange}
                >
                    <option value={5}>5</option>
                    <option value={15}>15</option>
                    <option value={50}>50</option>
                    <option value="all">Todos</option>
                </select>
            </div>

            {/* Botones de paginación */}
            {itemsPerPage !== totalItems && computedTotalPages > 1 && (
                <div className="flex space-x-2 ml-auto">
                    <button
                        className={`px-4 py-2 border rounded transition-all duration-200 ${
                            currentPage === 1
                                ? "opacity-50 cursor-not-allowed bg-gray-200"
                                : "hover:bg-gray-100 border-gray-300"
                        } ${
                            clickedButton === currentPage - 1
                                ? "!border-blue-800 shadow-[0_0_8px_2px_rgba(30,58,138,0.5)]"
                                : ""
                        }`}
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
                                        : "hover:bg-gray-100 border-gray-300"
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
                                ? "opacity-50 cursor-not-allowed bg-gray-200"
                                : "hover:bg-gray-100 border-gray-300"
                        } ${
                            clickedButton === currentPage + 1
                                ? "!border-blue-800 shadow-[0_0_8px_2px_rgba(30,58,138,0.5)]"
                                : ""
                        }`}
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