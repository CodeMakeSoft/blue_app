import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import ConfirmDelete from "@/Components/Favorite/ConfirmDelete";

export default function Form({ favorites: initialFavorites }) {
    const [favorites, setFavorites] = useState(initialFavorites || []);
    const [showSuccess, setShowSuccess] = useState(false);
    const [productoEliminar, setProductoEliminar] = useState(null);

    useEffect(() => {
        setFavorites(initialFavorites || []);
    }, [initialFavorites]);

    const eliminarFavorito = (id) => {
        Inertia.delete(route("favorites.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                setFavorites((prev) =>
                    prev.filter((fav) => fav.product.id !== id)
                );
                setShowSuccess(true);
                setProductoEliminar(null);
                setTimeout(() => setShowSuccess(false), 2000);
            },
            onError: () => {
                alert("Error al eliminar favorito");
            },
        });
    };

    return (
        <div className="relative">
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
                    Producto eliminado con éxito
                </div>
            )}
            {/* Modal de confirmación global y centrado */}
            {productoEliminar && (
                <ConfirmDelete
                    id={productoEliminar}
                    onConfirm={eliminarFavorito}
                    openGlobal={true}
                    onClose={() => setProductoEliminar(null)}
                />
            )}
            {(() => {
                const activos = favorites.filter((fav) => fav.product && fav.product.status);
                if (!favorites || favorites.length === 0 || activos.length === 0) {
                    return (
                        <div className="text-gray-500 text-center py-8">
                            No tienes productos favoritos.
                        </div>
                    );
                }
                return (
                    <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {activos.map((fav) => {
                            const product = fav.product;
                            return (
                                <a
                                    key={fav.id}
                                    href={route("products.show", product.id)}
                                    className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full relative group cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
                                    style={{ textDecoration: "none" }}
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                product.images &&
                                                product.images.length > 0
                                                    ? product.images[0].full_url
                                                    : "/images/no-image.png"
                                            }
                                            alt={product.name}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                Favorito
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3
                                            className="font-semibold text-lg mb-1 truncate"
                                            title={product.name}
                                        >
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 font-bold text-blue-600 dark:text-blue-400">
                                            ${product.price}
                                        </p>
                                        <div
                                            className="mt-auto flex justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setProductoEliminar(product.id);
                                            }}
                                        >
                                            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
                                                    />
                                                </svg>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                );
            })()}
        </div>
    );
}
