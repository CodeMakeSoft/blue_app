import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import CategoryCard from "@/Components/Category/CategoryCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Pagination from "@/Components/Category/Pagination";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Catalog({ auth, categories = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [paginatedCategories, setPaginatedCategories] = useState([]);

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
                <>
                    <Breadcrumb
                        routes={[{ name: "Inicio", link: route("dashboard") }]}
                        currentPage="Catálogo de Categorías"
                    />
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200 mt-2">
                        Catálogo de Categorías
                    </h2>
                </>
            }
        >
            <Head title="Catálogo de Categorías" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Título */}
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                        Catálogo de Categorías
                    </h1>

                    {/* Barra de búsqueda a ancho completo */}
                    <div className="mb-8">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar categorías por nombre o descripción..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    {/* Listado de categorías */}
                    {filteredCategories.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {paginatedCategories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={{
                                            ...category,
                                            image: category.image
                                                ? {
                                                    url: category.image.url,
                                                    id: category.image.id,
                                                }
                                                : null,
                                        }}
                                        showLink={true}
                                    />
                                ))}
                            </div>

                            {/* Contenedor de paginación y select */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                                {/* Select de items por página (izquierda) */}
                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        Mostrar:
                                    </label>
                                    <select
                                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-center w-40 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                    >
                                        {itemsPerPageOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Paginación */}
                                <div className="w-full sm:w-auto">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(
                                            filteredCategories.length /
                                                itemsPerPage
                                        )}
                                        onPageChange={handlePageChange}
                                        itemsPerPage={itemsPerPage}
                                        totalItems={filteredCategories.length}
                                        hideItemsPerPage={true}
                                    />
                                </div>
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
