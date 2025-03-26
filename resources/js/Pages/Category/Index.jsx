import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/category/Pagination";
import ConfirmDeleteModal from "@/Components/category/ConfirmDeleteModal";

export default function Index({ auth, categories }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [paginatedCategories, setPaginatedCategories] = useState([]);
    const totalItems = categories.length;

    const { delete: destroy } = useForm();

    // Actualizar los elementos paginados cuando cambien currentPage o itemsPerPage
    useEffect(() => {
        if (itemsPerPage >= totalItems) {
            setPaginatedCategories(categories);
        } else {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setPaginatedCategories(categories.slice(startIndex, endIndex));
        }
    }, [currentPage, itemsPerPage, categories]);

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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Gestión de Categorías
                    </h2>
                </div>
            }
        >
            <Head title="Category" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-end items-center mb-4">
                            <button
                                onClick={() =>
                                    (window.location.href =
                                        route("category.create"))
                                }
                                className="flex items-center bg-gray-800 text-white px-5 py-2.5 rounded-md hover:bg-gray-500 transition duration-300 shadow-lg border border-gray-800"
                            >
                                <PlusCircleIcon className="w-6 h-6 mr-2" />
                                Nueva Categoría
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
                                    {paginatedCategories.length > 0 ? (
                                        paginatedCategories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="hover:bg-gray-100"
                                            >
                                                <td className="px-4 py-3">
                                                    {category.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {category.description}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center space-x-2">
                                                        {category.images
                                                            ?.length > 0
                                                            ? category.images.map(
                                                                  (image) => (
                                                                      <img
                                                                          key={
                                                                              image.id
                                                                          }
                                                                          src={`/storage/${image.url}`}
                                                                          alt={`Imagen de ${category.name}`}
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
                                                            "category.edit",
                                                            category.id
                                                        )}
                                                    >
                                                        <PencilSquareIcon className="w-6 h-6 inline-block" />
                                                    </Link>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 ml-4"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category
                                                            )
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
                                                No hay categorías disponibles.
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
                            category={selectedCategory}
                            onClose={handleCloseModal}
                            onConfirm={handleConfirmDelete}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
