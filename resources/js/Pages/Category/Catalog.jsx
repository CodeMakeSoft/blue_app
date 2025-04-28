import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faEye, 
    faLayerGroup,
    faFilter 
} from '@fortawesome/free-solid-svg-icons';
import Pagination from "@/Components/Category/Pagination";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Catalog({ auth, categories = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [paginatedCategories, setPaginatedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Opciones personalizadas para el catálogo
    const itemsPerPageOptions = [
        { value: 4, label: "4" },
        { value: 8, label: "8" },
        { value: 12, label: "12" },
        { value: categories.length, label: "Todos" },
    ];

    // Filtrar y paginar categorías
    useEffect(() => {
        const filtered = categories.filter(
            (category) =>
                category &&
                [category.name, category.description || ""].some((text) =>
                    text.toLowerCase().includes(searchTerm.toLowerCase())
                )
        );

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedCategories(filtered.slice(startIndex, endIndex));
    }, [categories, searchTerm, currentPage, itemsPerPage]);

    const filteredCategories = categories.filter(
        (category) =>
            category &&
            [category.name, category.description || ""].some((text) =>
                text.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleItemsPerPageChange = (e) => {
        const value = Number(e.target.value);
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                        ]}
                        currentPage="Catálogo de Categorías"
                    />
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600" />
                        Catálogo de Categorías
                    </h2>
                </div>
            }
        >
            <Head title="Catálogo de Categorías" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Barra de búsqueda */}
                    <form className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Buscar categorías..."
                                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                    Filtros
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Grid de Categorías */}
                    {filteredCategories.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {paginatedCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 transform hover:scale-105 transition-all duration-300"
                                    >
                                        <div className="relative group">
                                            <div className="w-full h-32 flex items-center justify-center">
                                                <img
                                                    src={category.image ? `/storage/${category.image.url}` : 'https://via.placeholder.com/150'}
                                                    alt={category.name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                                                <Link
                                                    href={route("category.show", category.id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transform hover:scale-110 transition-all"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="text-center mt-4 font-semibold text-gray-900 dark:text-gray-100">
                                            {category.name}
                                        </h3>
                                        <p className="text-center text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2">
                                            {category.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Mostrar:
                                    </label>
                                    <select
                                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-center w-40 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                    >
                                        {itemsPerPageOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredCategories.length / itemsPerPage)}
                                    onPageChange={handlePageChange}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredCategories.length}
                                    hideItemsPerPage={true}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                {searchTerm
                                    ? "No se encontraron categorías con ese criterio"
                                    : "No hay categorías disponibles"}
                            </p>
                            {!searchTerm && auth.user?.isAdmin && (
                                <Link
                                    href={route("category.create")}
                                    className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    Crear primera categoría
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
