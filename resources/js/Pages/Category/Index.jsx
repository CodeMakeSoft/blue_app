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
    ChevronDownIcon,
    ChevronRightIcon,
    XMarkIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/Category/Pagination";
import ConfirmDeleteModal from "@/Components/Category/ConfirmDeleteModal";
import Breadcrumb from "@/Components/Breadcrumb";
import { toast, Toaster } from "sonner";
import { router } from "@inertiajs/react";

export default function Index({ auth, categories, can, flash }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [paginatedCategories, setPaginatedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { delete: destroy } = useForm();

    // Obtener solo categorías principales para mostrar inicialmente
    const mainCategories = categories.filter((category) => !category.parent_id);

    // Función para obtener subcategorías de una categoría específica
    const getSubcategories = (categoryId) => {
        return categories.filter(
            (category) => category.parent_id === categoryId
        );
    };

    // Función recursiva para aplanar las categorías mostradas
    const getDisplayedCategories = () => {
        let displayed = [];

        const buildCategoryTree = (category, level = 0) => {
            const hasChildren = getSubcategories(category.id).length > 0;

            displayed.push({
                ...category,
                level,
                isMain: level === 0,
                hasChildren,
            });

            // Si está expandida, agregar sus subcategorías
            if (expandedCategories.includes(category.id) && hasChildren) {
                const subcategories = getSubcategories(category.id);
                subcategories.forEach((sub) => {
                    buildCategoryTree(sub, level + 1);
                });
            }
        };

        mainCategories.forEach((category) => {
            buildCategoryTree(category);
        });

        return displayed;
    };

    // Mostrar notificaciones flash
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // Detectar si es móvil
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Filtrar y paginar categorías
    useEffect(() => {
        const filtered = getDisplayedCategories().filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        setPaginatedCategories(filtered.slice(startIndex, endIndex));
    }, [currentPage, itemsPerPage, categories, searchTerm, expandedCategories]);

    const filteredCategories = getDisplayedCategories().filter((c) =>
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
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedCategory(null);
                    router.reload({ only: ["categories", "filters"] });
                },
                onError: () => {
                    toast.error("No se pudo eliminar la categoría.");
                },
            });
        }
    };

    const handleCloseModal = () => {
        setSelectedCategory(null);
    };

    const toggleExpand = (categoryId) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
        setCurrentPage(1);
    };

    const getIndentation = (level) => {
        return { paddingLeft: `${level * 24}px` };
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

                    {/* Barra de búsqueda */}
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
                        {/* Tabla */}
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
                                        paginatedCategories.map(
                                            (category, index) => (
                                                <tr
                                                    key={`${category.id}-${category.level}`}
                                                    className={`${
                                                        index !==
                                                        paginatedCategories.length -
                                                            1
                                                            ? "border-b border-gray-200 dark:border-gray-700"
                                                            : ""
                                                    } hover:bg-gray-50 dark:hover:bg-gray-700`}
                                                >
                                                    <td className="px-4 py-3 align-middle text-gray-900 dark:text-gray-100">
                                                        <div
                                                            className="flex items-center"
                                                            style={getIndentation(
                                                                category.level
                                                            )}
                                                        >
                                                            {category.hasChildren && (
                                                                <button
                                                                    onClick={() =>
                                                                        toggleExpand(
                                                                            category.id
                                                                        )
                                                                    }
                                                                    className="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                                >
                                                                    {expandedCategories.includes(
                                                                        category.id
                                                                    ) ? (
                                                                        <ChevronDownIcon className="w-4 h-4" />
                                                                    ) : (
                                                                        <ChevronRightIcon className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                            )}
                                                            {!category.hasChildren && (
                                                                <span className="w-6"></span>
                                                            )}
                                                            {isMobile ? (
                                                                <div className="flex flex-col">
                                                                    <span>
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </span>
                                                                    {category.image && (
                                                                        <img
                                                                            src={`/storage/${category.image.url}`}
                                                                            alt={`Imagen de ${category.name}`}
                                                                            className="w-8 h-8 object-cover rounded mt-1"
                                                                        />
                                                                    )}
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                                        {
                                                                            category.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                category.name
                                                            )}
                                                        </div>
                                                    </td>
                                                    {!isMobile && (
                                                        <>
                                                            <td className="px-4 py-3 align-middle">
                                                                <p className="line-clamp-2 text-gray-600 dark:text-gray-300">
                                                                    {
                                                                        category.description
                                                                    }
                                                                </p>
                                                            </td>
                                                            <td className="px-4 py-3 align-middle text-center">
                                                                <div className="flex justify-center">
                                                                    {category.image ? (
                                                                        <img
                                                                            src={`/storage/${category.image.url}`}
                                                                            alt={`Imagen de ${category.name}`}
                                                                            className="w-12 h-12 object-cover rounded"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                                                                            Sin
                                                                            imagen
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                    <td className="px-4 py-3 align-middle">
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
                                            )
                                        )
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
