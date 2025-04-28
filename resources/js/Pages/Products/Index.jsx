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
                            { name: "Productos", link: route("products.index") },
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

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Header section with search and add button */}
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                {/* Search input */}
                                <div className="w-full sm:w-auto relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                        focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 
                                        focus:border-transparent transition duration-150 ease-in-out"
                                    />
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>

                                {/* Add product button */}
                                {can.product_create && (
                                    <Link
                                        href={route('products.create')}
                                        className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white 
                                        rounded-lg shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 
                                        transition-all duration-200 focus:outline-none focus:ring-2 
                                        focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                    >
                                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                                        <span>Agregar Producto</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Table section */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="px-6 py-3 text-sm font-semibold">Nombre</th>
                                        <th className="px-6 py-3 text-sm font-semibold">Precio</th>
                                        <th className="px-6 py-3 text-sm font-semibold">Imágenes</th>
                                        <th className="px-6 py-3 text-sm font-semibold text-center">Acciones</th>
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
                                                {product.images?.length >
                                                0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                scrollCarousel(
                                                                    product.id,
                                                                    "left"
                                                                )
                                                            }
                                                            className="p-1 rounded-full bg-gray-700 text-white hover:bg-gray-600"
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
                                                                        src={`/storage/${img.url}`} // Asumiendo que la propiedad que contiene la URL es 'url'
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
                                                            className="p-1 rounded-full bg-gray-700 text-white hover:bg-gray-600"
                                                        >
                                                            <ChevronRightIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        Sin imágenes
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-2">
                                                {can.product_edit && (
                                                    <Link
                                                        href={`/products/${product.id}/edit`}
                                                        className="inline-flex items-center text-blue-500 hover:text-blue-700"
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
                                                        className="inline-flex items-center text-red-500 hover:text-red-700"
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
                className="dark:bg-gray-800"
            />
        </AdminLayout>
    );
}
