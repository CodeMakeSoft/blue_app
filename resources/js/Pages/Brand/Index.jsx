import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
    EyeIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/Category/Pagination";
import ConfirmDeleteModal from "@/Components/Brand/ConfirmDeleteModal";

export default function Index({ auth, brands }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [paginatedBrands, setPaginatedBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const { delete: destroy } = useForm();

    useEffect(() => {
        const filtered = brands.filter((brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const totalFiltered = filtered.length;

        if (itemsPerPage >= totalFiltered) {
            setPaginatedBrands(filtered);
        } else {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setPaginatedBrands(filtered.slice(startIndex, endIndex));
        }
    }, [currentPage, itemsPerPage, brands, searchTerm]);

    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Marcas" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-3">
                    {/* Header con título y botón */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Gestión de Marcas
                        </h1>
                        <button
                            onClick={() =>
                                (window.location.href = route("brand.create"))
                            }
                            className="flex items-center bg-gray-100 text-gray-900 px-5 py-2.5 rounded-md hover:bg-gray-200 transition duration-300 shadow-sm"
                        >
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            Nueva Marca
                        </button>
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Buscar marcas por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Contenedor de la tabla */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Tabla con bordes redondeados */}
                        <div className="overflow-x-auto border-t border-gray-200 rounded-b-lg mx-6 my-2 pt-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-800">
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
                                                    index !==
                                                    paginatedBrands.length - 1
                                                        ? "border-b border-gray-200"
                                                        : ""
                                                } hover:bg-gray-50`}
                                            >
                                                <td className="px-4 py-3 align-middle">
                                                    {brand.name}
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <p className="line-clamp-2 text-gray-600">
                                                        {brand.description}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 align-middle text-center">
                                                    <div className="flex justify-center">
                                                        {brand.image ? (
                                                            <img
                                                                src={`/storage/${brand.image.url}`}
                                                                alt={`Imagen de ${brand.name}`}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">
                                                                Sin imagen
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="flex justify-center space-x-4">
                                                        <Link
                                                            href={route(
                                                                "brand.show",
                                                                {
                                                                    brand: brand.id,
                                                                }
                                                            )}
                                                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                                            title="Ver detalle"
                                                        >
                                                            <EyeIcon className="w-6 h-6" />
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "brand.edit",
                                                                {
                                                                    brand: brand.id,
                                                                }
                                                            )}
                                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                                                            title="Editar"
                                                        >
                                                            <PencilSquareIcon className="w-6 h-6" />
                                                        </Link>
                                                        <button
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    brand
                                                                )
                                                            }
                                                            title="Eliminar"
                                                        >
                                                            <TrashIcon className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-6 text-center text-gray-500 rounded-b-lg"
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

                        {/* Paginación */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(
                                    filteredBrands.length / itemsPerPage
                                )}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
                                totalItems={filteredBrands.length}
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
        </AuthenticatedLayout>
    );
}
