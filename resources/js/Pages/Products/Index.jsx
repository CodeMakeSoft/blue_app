import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/Category/Pagination";
import ConfirmDeleteModal from "@/Components/Product/ConfirmDelete";
import Breadcrumb from "@/Components/Breadcrumb";
import { usePage } from "@inertiajs/react";

export default function Index({ products, can }) {
    const { delete: destroy } = useForm();
    const { auth } = usePage().props;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const carouselRefs = useRef({});
    const [scrollStates, setScrollStates] = useState({});

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    useEffect(() => {
        const initialStates = {};
        paginatedProducts.forEach((product) => {
            if (product.images?.length > 0) {
                initialStates[product.id] = {
                    position: 0,
                    maxScroll: (product.images.length - 1) * 116,
                    canScrollLeft: false,
                    canScrollRight: product.images.length > 2,
                };
            }
        });
        setScrollStates(initialStates);
    }, [paginatedProducts]);

    const handleDelete = (product) => {
        setSelectedProduct(product);
    };

    const handleConfirmDelete = () => {
        if (selectedProduct) {
            destroy(route("products.destroy", selectedProduct.id), {
                onSuccess: () => {
                    setSelectedProduct(null);
                },
            });
        }
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const scrollCarousel = (productId, direction) => {
        const carousel = carouselRefs.current[productId];
        if (!carousel) return;

        const currentState = scrollStates[productId] || {
            position: 0,
            maxScroll: 0,
        };
        const scrollAmount = 232;

        let newPosition;
        if (direction === "left") {
            newPosition = Math.max(0, currentState.position - scrollAmount);
        } else {
            newPosition = Math.min(
                currentState.maxScroll,
                currentState.position + scrollAmount
            );
        }

        carousel.scrollTo({
            left: newPosition,
            behavior: "smooth",
        });

        setScrollStates((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                position: newPosition,
                canScrollLeft: newPosition > 0,
                canScrollRight: newPosition < currentState.maxScroll,
            },
        }));
    };

    const handleScroll = (productId) => {
        const carousel = carouselRefs.current[productId];
        if (carousel) {
            const newPosition = carousel.scrollLeft;
            const currentState = scrollStates[productId] || { maxScroll: 0 };

            setScrollStates((prev) => ({
                ...prev,
                [productId]: {
                    ...prev[productId],
                    position: newPosition,
                    canScrollLeft: newPosition > 0,
                    canScrollRight: newPosition < currentState.maxScroll,
                },
            }));
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Admin", link: route("admin.panel") },
                            {
                                name: "Productos",
                                link: route("products.index"),
                            },
                        ]}
                        currentPage="Lista de Productos"
                    />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Lista de Productos
                    </h2>
                </div>
            }
        >
            <Head title="Productos" />

            <div className="py-5">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-3">
                    {/* Header con título y botón */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            Gestión de Productos
                        </h1>
                        {can.product_create && (
                            <Link
                                href={route("products.create")}
                                className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-5 py-2.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 shadow-sm"
                            >
                                <PlusCircleIcon className="w-5 h-5 mr-2" />
                                Agregar Producto
                            </Link>
                        )}
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Buscar productos por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Contenedor de la tabla */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="overflow-x-auto border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="px-6 py-3 text-sm font-semibold">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-sm font-semibold">
                                            Precio
                                        </th>
                                        <th className="px-6 py-3 text-sm font-semibold">
                                            Imágenes
                                        </th>
                                        <th className="px-6 py-3 text-sm font-semibold text-center">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {paginatedProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                                        >
                                            <td className="px-6 py-4">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                ${product.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.images?.length > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                scrollCarousel(
                                                                    product.id,
                                                                    "left"
                                                                )
                                                            }
                                                            className="p-1 rounded-full bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500"
                                                        >
                                                            <ChevronLeftIcon className="w-5 h-5" />
                                                        </button>
                                                        <div
                                                            ref={(el) =>
                                                                (carouselRefs.current[
                                                                    product.id
                                                                ] = el)
                                                            }
                                                            onScroll={() =>
                                                                handleScroll(
                                                                    product.id
                                                                )
                                                            }
                                                            className="flex gap-2 overflow-hidden max-w-[250px]"
                                                        >
                                                            {product.images.map(
                                                                (
                                                                    img,
                                                                    index
                                                                ) => (
                                                                    <img
                                                                        key={
                                                                            index
                                                                        }
                                                                        src={`/storage/${img.url}`}
                                                                        alt={`Producto ${product.id} - ${index}`}
                                                                        className="h-20 w-20 object-cover rounded-md border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                scrollCarousel(
                                                                    product.id,
                                                                    "right"
                                                                )
                                                            }
                                                            className="p-1 rounded-full bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500"
                                                        >
                                                            <ChevronRightIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">
                                                        Sin imágenes
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-2">
                                                {can.product_edit && (
                                                    <Link
                                                        href={`/products/${product.id}/edit`}
                                                        className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                                                    >
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </Link>
                                                )}
                                                {can.product_delete && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                product
                                                            )
                                                        }
                                                        className="inline-flex items-center text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                product={selectedProduct}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </AdminLayout>
    );
}