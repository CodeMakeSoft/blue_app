import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/Category/Pagination";
import ConfirmDeleteModal from "@/Components/Category/ConfirmDeleteModal";
import Breadcrumb from "@/Components/Breadcrumb";
import { toast, Toaster } from "sonner";

export default function Index({ auth, categories, can, flash }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [paginatedCategories, setPaginatedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { delete: destroy } = useForm();

    useEffect(() => {
        console.log("Flash success:", flash);
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const totalFiltered = filtered.length;

        if (itemsPerPage >= totalFiltered) {
            setPaginatedCategories(filtered);
        } else {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setPaginatedCategories(filtered.slice(startIndex, endIndex));
        }
    }, [currentPage, itemsPerPage, categories, searchTerm]);

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
    };

    const handleConfirmDelete = () => {
        if (selectedCategory) {
            destroy(route("category.destroy", selectedCategory.id), {
                onSuccess: () => {
                    setSelectedCategory(null);
                },
            });
        }
    };

    const handleCloseModal = () => {
        setSelectedCategory(null);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[{ name: "Admin", link: route("admin.panel") }]}
                        currentPage="Gestión de Categorías"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Categorías
                    </h2>
                </div>
            }
        >
            <Head title="Categorías" />
            <Toaster richColors position="top-right" />

            <div className="py-4 md:py-10">
                <div className="mx-auto px-2 sm:px-4 lg:px-4 max-w-7xl">
                    {/* Header con título y botón */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            Gestión de Categorías
                        </h1>

                        <div className="flex gap-2 w-full md:w-auto">
                            {isMobile && (
                                <button
                                    onClick={() =>
                                        setMobileFiltersOpen(!mobileFiltersOpen)
                                    }
                                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                    {mobileFiltersOpen ? (
                                        <XMarkIcon className="h-5 w-5" />
                                    ) : (
                                        <FunnelIcon className="h-5 w-5" />
                                    )}
                                </button>
                            )}

                            {can.category_create && (
                                <Link
                                    href={route("category.create")}
                                    className="flex items-center justify-center w-full md:w-auto bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 md:px-5 md:py-2.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 shadow-sm text-sm md:text-base"
                                >
                                    <PlusCircleIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                                    <span className="whitespace-nowrap">
                                        Nueva Categoría
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Barra de búsqueda - Versión móvil condicional */}
                    {(mobileFiltersOpen || !isMobile) && (
                        <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-8 md:pl-10 pr-3 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Contenedor de la tabla */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                        {/* Tabla con bordes redondeados y espacio superior */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider"
                                        >
                                            Nombre
                                        </th>
                                        {!isMobile && (
                                            <>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider"
                                                >
                                                    Descripción
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider"
                                                >
                                                    Imagen
                                                </th>
                                            </>
                                        )}
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider"
                                        >
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {paginatedCategories.length > 0 ? (
                                        paginatedCategories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    <div className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100">
                                                        {category.name}
                                                    </div>
                                                    {isMobile && (
                                                        <div className="mt-1 flex flex-col space-y-1">
                                                            <div className="flex items-center justify-start">
                                                                {category.image ? (
                                                                    <img
                                                                        src={`/storage/${category.image.url}`}
                                                                        alt={`Imagen de ${category.name}`}
                                                                        className="w-8 h-8 object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                                        Sin
                                                                        imagen
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                                {
                                                                    category.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </td>

                                                {!isMobile && (
                                                    <>
                                                        <td className="px-3 py-3">
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                                {
                                                                    category.description
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            {category.image ? (
                                                                <img
                                                                    src={`/storage/${category.image.url}`}
                                                                    alt={`Imagen de ${category.name}`}
                                                                    className="w-10 h-10 md:w-12 md:h-12 object-cover rounded mx-auto"
                                                                />
                                                            ) : (
                                                                <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                                                                    Sin imagen
                                                                </span>
                                                            )}
                                                        </td>
                                                    </>
                                                )}

                                                <td className="px-3 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                    <div className="flex justify-center space-x-2 md:space-x-4">
                                                        <Link
                                                            href={route(
                                                                "category.show",
                                                                {
                                                                    category:
                                                                        category.id,
                                                                }
                                                            )}
                                                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            title="Ver detalle"
                                                        >
                                                            <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                        </Link>
                                                        {can.category_edit && (
                                                            <Link
                                                                href={route(
                                                                    "category.edit",
                                                                    {
                                                                        category:
                                                                            category.id,
                                                                    }
                                                                )}
                                                                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50"
                                                                title="Editar"
                                                            >
                                                                <PencilSquareIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                            </Link>
                                                        )}
                                                        {can.category_delete && (
                                                            <button
                                                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category
                                                                    )
                                                                }
                                                                title="Eliminar"
                                                            >
                                                                <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={isMobile ? 2 : 4}
                                                className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                {searchTerm
                                                    ? "No se encontraron categorías"
                                                    : "No hay categorías disponibles"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(
                                    filteredCategories.length / itemsPerPage
                                )}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
                                totalItems={filteredCategories.length}
                                isMobile={isMobile}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                category={selectedCategory}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </AdminLayout>
    );
}
