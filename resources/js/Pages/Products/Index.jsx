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
import { usePage } from "@inertiajs/react";


export default function Index({ products }) {
    const { delete: destroy } = useForm();
    const { auth } = usePage().props;
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
                                <span className="text-sm sm:text-base">Agregar Producto</span>
                            </Link>
                        </div>
    
                        {/* Contenedor scroll responsivo */}
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[700px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="w-full text-left text-gray-700 dark:text-gray-300">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Precio</th>
                                        <th className="px-4 py-2">Imágenes</th>
                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                                        >
                                            <td className="px-4 py-2">{product.name}</td>
                                            <td className="px-4 py-2">${product.price}</td>
                                            <td className="px-4 py-4">
                                                {product.images?.length > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => scrollCarousel(product.id, "left")}
                                                            className="p-1 rounded-full bg-gray-700 text-white hover:bg-gray-600"
                                                        >
                                                            <ChevronLeftIcon className="w-5 h-5" />
                                                        </button>
                                                        <div
                                                            ref={(el) => (carouselRefs.current[product.id] = el)}
                                                            onScroll={() => handleScroll(product.id)}
                                                            className="flex gap-2 overflow-hidden max-w-[250px]"
                                                        >
                                                            {product.images.map((img, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={`/storage/${img.url}`}  // Asumiendo que la propiedad que contiene la URL es 'url'
                                                                    alt={`Producto ${product.id} - ${index}`}
                                                                    className="h-20 w-20 object-cover rounded-md border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                                                />
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => scrollCarousel(product.id, "right")}
                                                            className="p-1 rounded-full bg-gray-700 text-white hover:bg-gray-600"
                                                        >
                                                            <ChevronRightIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Sin imágenes</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center space-x-2">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="inline-flex items-center text-blue-500 hover:text-blue-700"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => openDeleteModal(product)}
                                                    className="inline-flex items-center text-red-500 hover:text-red-700"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
