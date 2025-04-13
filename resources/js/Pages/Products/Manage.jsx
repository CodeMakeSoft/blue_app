import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";

export default function Manage({ products = [] }) {
    console.log(products);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [likes, setLikes] = useState({});

    const handleImageClick = (product) => {
        console.log("Clic en producto:", product.id);
        router.get(`/products/${product.id}`);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const handleLike = (id) => {
        setLikes((prevLikes) => {
            if (prevLikes[id]) return prevLikes; // Si ya hay "me gusta", no hacer nada
            return {
                ...prevLikes,
                [id]: 1, // Establece el "me gusta" en 1
            };
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Menú de Productos
                </h2>
            }
        >
            <Head title="Menú de Productos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onClick={() => handleImageClick(product)}
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        ${product.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
