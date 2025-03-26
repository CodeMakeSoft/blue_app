import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/brand/Pagination";
import ConfirmDeleteModal from "@/Components/brand/ConfirmDeleteModal";

export default function Index({ auth, brands }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [paginatedBrands, setPaginatedBrands] = useState([]);
    const totalItems = brands.length;

    const { delete: destroy } = useForm();

    // Actualizar los elementos paginados cuando cambien currentPage o itemsPerPage
    useEffect(() => {
        if (itemsPerPage >= totalItems) {
            setPaginatedBrands(brands);
        } else {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setPaginatedBrands(brands.slice(startIndex, endIndex));
        }
    }, [currentPage, itemsPerPage, brands]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = (brand) => {
        setSelectedBrand(brand);
    };

    const handleConfirmDelete = () => {
        if (selectedBrand) {
            destroy(route("brand.destroy", selectedBrand.id), {
                onSuccess: () => {
                    setSelectedBrand(null);
                },
            });
        }
    };

    const handleCloseModal = () => {
        setSelectedBrand(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Gestión de Marcas
                    </h2>
                </div>
            }
        >
            <Head title="Brand" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-end items-center mb-4">
                            <button
                                onClick={() =>
                                    (window.location.href =
                                        route("brand.create"))
                                }
                                className="flex items-center bg-gray-800 text-white px-5 py-2.5 rounded-md hover:bg-gray-500 transition duration-300 shadow-lg border border-gray-800"
                            >
                                <PlusCircleIcon className="w-6 h-6 mr-2" />
                                Nueva Marca
                            </button>
                        </div>

                        {/* Tabla sin líneas */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="px-4 py-3 text-left">
                                            Nombre
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Imágenes
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBrands.length > 0 ? (
                                        paginatedBrands.map((brand) => (
                                            <tr
                                                key={brand.id}
                                                className="hover:bg-gray-100"
                                            >
                                                <td className="px-4 py-3">
                                                    {brand.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {brand.description}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center space-x-2">
                                                        {brand.images?.length >
                                                        0
                                                            ? brand.images.map(
                                                                  (image) => (
                                                                      <img
                                                                          key={
                                                                              image.id
                                                                          }
                                                                          src={`/storage/${image.url}`}
                                                                          alt={`Imagen de ${brand.name}`}
                                                                          className="w-12 h-12 object-cover rounded"
                                                                      />
                                                                  )
                                                              )
                                                            : "No hay imágenes"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        className="text-blue-500 hover:text-blue-700"
                                                        href={route(
                                                            "brand.edit",
                                                            brand.id
                                                        )}
                                                    >
                                                        <PencilSquareIcon className="w-6 h-6 inline-block" />
                                                    </Link>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 ml-4"
                                                        onClick={() =>
                                                            handleDelete(brand)
                                                        }
                                                    >
                                                        <TrashIcon className="w-6 h-6 inline-block" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-4 py-3 text-center text-gray-600"
                                            >
                                                No hay Marcas disponibles.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={
                                    itemsPerPage >= totalItems
                                        ? 1
                                        : Math.ceil(totalItems / itemsPerPage)
                                }
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
                                totalItems={totalItems}
                            />
                        </div>

                        {/* Modal de confirmación */}
                        <ConfirmDeleteModal
                            brand={selectedBrand}
                            onClose={handleCloseModal}
                            onConfirm={handleConfirmDelete}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
