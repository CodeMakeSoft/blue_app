import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/Category/Pagination";
import ConfirmDeleteModal from "@/Components/Brand/ConfirmDeleteModal";
import Breadcrumb from "@/Components/Breadcrumb";
import { toast, Toaster } from "sonner";

export default function Index({ auth, brands, can, flash }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
<<<<<<< HEAD
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

=======
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [paginatedBrands, setPaginatedBrands] = useState(brands.data);
>>>>>>> a7b66f4dd3dd0c955eb3024861bcf83d19b841bd
    const { delete: destroy } = useForm();
    const isMounted = useRef(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    useEffect(() => {
<<<<<<< HEAD
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const filtered = brands.filter((brand) =>
=======
        const filtered = brands.data.filter((brand) =>
>>>>>>> a7b66f4dd3dd0c955eb3024861bcf83d19b841bd
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const totalFiltered = filtered.length;
        let result;

        if (itemsPerPage >= totalFiltered) {
            result = filtered;
        } else {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            result = filtered.slice(startIndex, endIndex);
        }

        setPaginatedBrands(result);

        const delay = setTimeout(() => {
            router.get(
                route("brand.index"),
                { search: searchTerm },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 300);
        
        return () => clearTimeout(delay);
    }, [searchTerm, currentPage, itemsPerPage]);

    const handleDelete = (brand) => {
        setSelectedBrand(brand);
    };

    const handleConfirmDelete = () => {
        if (selectedBrand) {
            destroy(route("brand.destroy", selectedBrand.id), {
                onSuccess: () => {
                    setSelectedBrand(null);
                    toast.success("Marca eliminada correctamente");
                },
                onError: () => {
                    toast.error("Error al eliminar la marca");
                },
            });
        }
    };

    const handleCloseModal = () => setSelectedBrand(null);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[{ name: "Admin", link: route("admin.panel") }]}
                        currentPage="Gestión de Marcas"
                    />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-2">
                        Marcas
                    </h2>
                </div>
            }
        >
            <Head title="Marcas" />
            <Toaster richColors position="top-right" />

<<<<<<< HEAD
            <div className="py-4 md:py-10">
                <div className="mx-auto px-2 sm:px-4 lg:px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            Gestión de Marcas
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

                            {can.brand_create && (
                                <button
                                    onClick={() =>
                                        (window.location.href =
                                            route("brand.create"))
                                    }
                                    className="flex items-center justify-center w-full md:w-auto bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 md:px-5 md:py-2.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 shadow-sm text-sm md:text-base"
                                >
                                    <PlusCircleIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                                    <span>Nueva Marca</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {(mobileFiltersOpen || !isMobile) && (
                        <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-8 md:pl-10 pr-3 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Buscar marcas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
=======
            <div className="py-10">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-3">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            Gestión de Marcas
                        </h1>
                        {can.brand_create && (
                            <Link
                                href={route("brand.create")}
                                className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-5 py-2.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 shadow-sm"
                            >
                                <PlusCircleIcon className="w-5 h-5 mr-2" />
                                Nueva Marca
                            </Link>
                        )}
                    </div>

                    {/* Search */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Buscar marcas por nombre o descripción..."
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="overflow-x-auto border-t border-gray-200 dark:border-gray-700 rounded-b-lg mx-6 my-2 pt-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                        <th className="px-4 py-3 text-left text-sm font-medium w-1/5 rounded-tl-lg">
>>>>>>> a7b66f4dd3dd0c955eb3024861bcf83d19b841bd
                                            Nombre
                                        </th>
                                        {!isMobile && (
                                            <>
                                                <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                                                    Descripción
                                                </th>
                                                <th className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                                                    Imagen
                                                </th>
                                            </>
                                        )}
                                        <th className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {paginatedBrands.length > 0 ? (
                                        paginatedBrands.map((brand) => (
                                            <tr
                                                key={brand.id}
<<<<<<< HEAD
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    <div className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100">
                                                        {brand.name}
=======
                                                className={`${
                                                    index !== paginatedBrands.length - 1
                                                        ? "border-b border-gray-200 dark:border-gray-700"
                                                        : ""
                                                } hover:bg-gray-50 dark:hover:bg-gray-700`}
                                            >
                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                    {brand.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="line-clamp-2 text-gray-600 dark:text-gray-300">
                                                        {brand.description}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center">
                                                        {brand.image ? (
                                                            <img
                                                                src={`/storage/${brand.image.url}`}
                                                                alt={`Imagen de ${brand.name}`}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                                                                Sin imagen
                                                            </span>
                                                        )}
>>>>>>> a7b66f4dd3dd0c955eb3024861bcf83d19b841bd
                                                    </div>
                                                    {isMobile && (
                                                        <div className="mt-1 flex flex-col space-y-1">
                                                            <div className="flex items-center justify-start">
                                                                {brand.image ? (
                                                                    <img
                                                                        src={`/storage/${
                                                                            brand
                                                                                .image
                                                                                .url
                                                                        }?t=${new Date().getTime()}`}
                                                                        alt={`Imagen de ${brand.name}`}
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
                                                                    brand.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </td>
<<<<<<< HEAD
                                                {!isMobile && (
                                                    <>
                                                        <td className="px-3 py-3">
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                                {
                                                                    brand.description
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            {brand.image ? (
                                                                <img
                                                                    src={`/storage/${
                                                                        brand
                                                                            .image
                                                                            .url
                                                                    }?t=${new Date().getTime()}`}
                                                                    alt={`Imagen de ${brand.name}`}
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
                                                <td className="px-3 py-3 text-center text-sm font-medium">
                                                    <div className="flex justify-center space-x-2 md:space-x-4">
=======
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center space-x-4">
>>>>>>> a7b66f4dd3dd0c955eb3024861bcf83d19b841bd
                                                        <Link
                                                            href={route("brand.show", brand.id)}
                                                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            title="Ver detalle"
                                                        >
                                                            <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                        </Link>
                                                        {can.brand_edit && (
                                                            <Link
                                                                href={route("brand.edit", brand.id)}
                                                                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50"
                                                                title="Editar"
                                                            >
                                                                <PencilSquareIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                            </Link>
                                                        )}
                                                        {can.brand_delete && (
                                                            <button
                                                                onClick={() => handleDelete(brand)}
                                                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
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
                                                    ? "No se encontraron marcas"
                                                    : "No hay marcas disponibles"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
<<<<<<< HEAD

                        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
=======
                        <div className="px-3 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
>>>>>>> a7b66f4dd3dd0c955eb3024861bcf83d19b841bd
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(brands.total / itemsPerPage)}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
<<<<<<< HEAD
                                totalItems={filteredBrands.length}
                                isMobile={isMobile}
=======
                                totalItems={brands.total}
>>>>>>> a7b66f4dd3dd0c955eb3024861bcf83d19b841bd
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                brand={selectedBrand}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </AdminLayout>
    );
}