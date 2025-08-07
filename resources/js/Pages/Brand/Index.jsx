import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
    EyeIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/Category/Pagination";
import ConfirmDeleteModal from "@/Components/Brand/ConfirmDeleteModal";
import Breadcrumb from "@/Components/Breadcrumb";
import { toast, Toaster } from "sonner";

export default function Index({ auth, brands, can, flash }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [paginatedBrands, setPaginatedBrands] = useState(brands.data);
    const { delete: destroy } = useForm();
    const isMounted = useRef(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    useEffect(() => {
        const filtered = brands.data.filter((brand) =>
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
                                            Nombre
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium w-2/5">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-medium w-1/5">
                                            Imagen
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-medium w-1/5 rounded-tr-lg">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBrands.length > 0 ? (
                                        paginatedBrands.map((brand, index) => (
                                            <tr
                                                key={brand.id}
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
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center space-x-4">
                                                        <Link
                                                            href={route("brand.show", brand.id)}
                                                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            title="Ver detalle"
                                                        >
                                                            <EyeIcon className="w-6 h-6" />
                                                        </Link>
                                                        {can.brand_edit && (
                                                            <Link
                                                                href={route("brand.edit", brand.id)}
                                                                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50"
                                                                title="Editar"
                                                            >
                                                                <PencilSquareIcon className="w-6 h-6" />
                                                            </Link>
                                                        )}
                                                        {can.brand_delete && (
                                                            <button
                                                                onClick={() => handleDelete(brand)}
                                                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
                                                                title="Eliminar"
                                                            >
                                                                <TrashIcon className="w-6 h-6" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 rounded-b-lg"
                                            >
                                                {searchTerm
                                                    ? "No se encontraron marcas con ese nombre"
                                                    : "No hay marcas disponibles"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-3 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(brands.total / itemsPerPage)}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
                                totalItems={brands.total}
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