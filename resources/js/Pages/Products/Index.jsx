import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    PencilSquareIcon,
    PlusCircleIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";
import ConfirmDelete from "@/Components/Product/ConfirmDelete";
import Pagination from "@/Components/Product/Pagination";

export default function Index({ products }) {
    const { delete: destroy } = useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const carouselRefs = useRef({});
    const [scrollStates, setScrollStates] = useState({});

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    useEffect(() => {
        const initialStates = {};
        currentProducts.forEach((product) => {
            initialStates[product.id] = {
                position: 0,
                maxScroll: Math.max(
                    0,
                    ((product.images?.length || 0) - 2) * 116
                ),
            };
        });
        setScrollStates(initialStates);
    }, [currentProducts]);

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleConfirmDelete = () => {
        if (selectedProduct) {
            destroy(route("products.destroy", selectedProduct.id), {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
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
            },
        }));
    };

    const handleScroll = (productId) => {
        const carousel = carouselRefs.current[productId];
        if (carousel) {
            setScrollStates((prev) => ({
                ...prev,
                [productId]: {
                    ...prev[productId],
                    position: carousel.scrollLeft,
                },
            }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg sm:text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Lista de Productos
                </h2>
            }
        >
            <Head title="Productos" />
            <div className="py-4 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
                        <div className="flex justify-end mb-3 sm:mb-4">
                            <Link
                                href="/products/create"
                                className="flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                                border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 
                                hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 
                                focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                <PlusCircleIcon className="h-5 w-5 text-gray-800 dark:text-gray-200 mr-1 sm:mr-2" />
                                <span className="text-sm sm:text-base">
                                    Agregar Producto
                                </span>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="w-full text-left text-gray-700 dark:text-gray-300">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr className="text-xs sm:text-sm uppercase">
                                            <th className="px-3 py-2 sm:px-4 sm:py-3">
                                                Imágenes
                                            </th>
                                            <th className="px-3 py-2 sm:px-4 sm:py-3">
                                                Nombre
                                            </th>
                                            <th className="hidden sm:table-cell px-4 py-3">
                                                Descripción
                                            </th>
                                            <th className="px-3 py-2 sm:px-4 sm:py-3">
                                                Precio
                                            </th>
                                            <th className="hidden xs:table-cell px-4 py-3">
                                                Stock
                                            </th>
                                            <th className="hidden sm:table-cell px-4 py-3">
                                                Estado
                                            </th>
                                            <th className="px-3 py-2 sm:px-4 sm:py-3">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.length > 0 ? (
                                            currentProducts.map((product) => {
                                                const imageCount =
                                                    product.images?.length || 0;
                                                const showNavigation =
                                                    imageCount > 2;
                                                const currentScroll =
                                                    scrollStates[product.id]
                                                        ?.position || 0;
                                                const maxScroll =
                                                    scrollStates[product.id]
                                                        ?.maxScroll || 0;

                                                return (
                                                    <tr
                                                        key={product.id}
                                                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        <td className="px-3 py-2 sm:px-4 sm:py-4">
                                                            <div className="relative">
                                                                <div
                                                                    ref={(el) =>
                                                                        (carouselRefs.current[
                                                                            product.id
                                                                        ] = el)
                                                                    }
                                                                    className="flex gap-2 overflow-x-auto py-1 sm:py-2 w-[180px] sm:w-[216px] scrollbar-hide"
                                                                    onScroll={() =>
                                                                        handleScroll(
                                                                            product.id
                                                                        )
                                                                    }
                                                                    style={{
                                                                        scrollbarWidth:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    {imageCount >
                                                                    0 ? (
                                                                        product.images.map(
                                                                            (
                                                                                image
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        image.id
                                                                                    }
                                                                                    className="flex-shrink-0"
                                                                                >
                                                                                    <img
                                                                                        src={
                                                                                            image.url.startsWith(
                                                                                                "http"
                                                                                            )
                                                                                                ? image.url
                                                                                                : `/storage/${image.url}`
                                                                                        }
                                                                                        alt={`Imagen de ${product.name}`}
                                                                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover shadow-sm border dark:border-gray-600"
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        )
                                                                    ) : (
                                                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-300">
                                                                            Sin
                                                                            imagen
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {showNavigation && (
                                                                    <>
                                                                        {currentScroll >
                                                                            0 && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    scrollCarousel(
                                                                                        product.id,
                                                                                        "left"
                                                                                    )
                                                                                }
                                                                                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                                                            >
                                                                                <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                            </button>
                                                                        )}
                                                                        {currentScroll <
                                                                            maxScroll && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    scrollCarousel(
                                                                                        product.id,
                                                                                        "right"
                                                                                    )
                                                                                }
                                                                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                                                            >
                                                                                <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                            </button>
                                                                        )}
                                                                        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black bg-opacity-50 text-white text-xxs sm:text-xs px-1 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                                                            {Math.min(
                                                                                imageCount,
                                                                                Math.ceil(
                                                                                    currentScroll /
                                                                                        116
                                                                                ) +
                                                                                    2
                                                                            )}
                                                                            /
                                                                            {
                                                                                imageCount
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 sm:px-4 sm:py-4 font-semibold dark:text-gray-200 whitespace-nowrap">
                                                            {product.name}
                                                        </td>
                                                        <td className="hidden sm:table-cell px-4 py-4 text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                            {
                                                                product.description
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 sm:px-4 sm:py-4 font-medium dark:text-gray-200 whitespace-nowrap">
                                                            ${product.price}
                                                        </td>
                                                        <td className="hidden xs:table-cell px-4 py-4 dark:text-gray-200">
                                                            {product.stock}
                                                        </td>
                                                        <td className="hidden sm:table-cell px-4 py-4 dark:text-gray-200">
                                                            {product.status
                                                                ? "Activo"
                                                                : "Inactivo"}
                                                        </td>
                                                        <td className="px-3 py-2 sm:px-4 sm:py-4 flex space-x-1 sm:space-x-2">
                                                            <Link
                                                                href={`/products/${product.id}/edit`}
                                                                className="p-1 sm:p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-green-100 dark:hover:bg-green-900 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                                            >
                                                                <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        product
                                                                    )
                                                                }
                                                                className="p-1 sm:p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-red-100 dark:hover:bg-red-900 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                                            >
                                                                <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                                                >
                                                    No hay productos
                                                    disponibles.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
            {modalOpen && (
                <ConfirmDelete
                    product={selectedProduct}
                    onClose={closeModal}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </AuthenticatedLayout>
    );
}
