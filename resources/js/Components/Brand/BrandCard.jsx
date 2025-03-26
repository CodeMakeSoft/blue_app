// resources/js/Components/BrandCard.jsx
import React from "react";
import { Link } from "@inertiajs/react";

export default function BrandCard({ brand, showLink = false }) {
    // Obtener la URL de la imagen, manejando posibles errores en la estructura de datos
    const imageUrl =
        brand.images?.length > 0
            ? brand.images[0].url.startsWith("images/")
                ? `/${brand.images[0].url}` // Si ya incluye 'images/', no agregar 'storage/'
                : `/storage/${brand.images[0].url}` // En caso contrario, agregar 'storage/'
            : null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            {/* Imagen de la marca */}
            {imageUrl ? (
                <img
                    src={`/storage/${brand.images[0].url}`}
                    alt={`Logo ${brand.name}`}
                />
            ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                </div>
            )}

            {/* Detalles de la marca */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {brand.name}
                </h3>
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                    {brand.description || "Descripción no disponible"}
                </p>

                {/* Opcional: Enlace a detalles */}
                {showLink && (
                    <Link
                        href={route("brand.show", brand.id)}
                        className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline"
                    >
                        Ver productos →
                    </Link>
                )}
            </div>
        </div>
    );
}
