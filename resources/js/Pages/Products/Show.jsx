import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Heart } from "lucide-react";

export default function Show({ product }) {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {product.name}
                </h2>
            }
        >
            <Head title={`Detalle - ${product.name}`} />

            <div className="py-12 flex justify-center">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 w-full max-w-5xl transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-80 object-cover rounded-xl shadow-md"
                        />
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {product.name}
                            </h3>

                            <p className="text-2xl text-green-600 dark:text-green-400 mt-3 font-semibold">
                                ${product.price}
                            </p>

                            <p className="text-sm text-gray-500 mb-2">
                                Llega entre{" "}
                                <span className="font-medium">3 y 5 días</span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mt-5 leading-relaxed">
                                {product.description}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mt-3 italic">
                                Stock disponible: {product.stock}
                            </p>

                            <div className="mt-8 flex gap-4">
                                {/* Botón de me gusta */}
                                <button
                                    onClick={handleLike}
                                    disabled={liked}
                                    className={`p-2 rounded-full border ${
                                        liked
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <Heart
                                        size={24}
                                        fill={liked ? "black" : "none"}
                                        color="black"
                                    />
                                </button>
                                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg shadow transition">
                                    Agregar al carrito
                                </button>
                                <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow transition">
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
