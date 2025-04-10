import React from "react";
import { Link } from "@inertiajs/react";

export default function BrandCard({ brand, showLink = true }) {
    // Función para normalizar la URL de la imagen
    const getImageUrl = () => {
        if (!brand.image && !brand.images?.length) return null;

        // Maneja tanto 'image' (uno-a-uno) como 'images' (uno-a-muchos)
        const imageData = brand.image || brand.images?.[0];
        if (!imageData?.url) return null;

        // Normaliza la URL (elimina 'storage/' si ya está presente)
        let url = imageData.url;
        if (url.startsWith("storage/")) {
            url = url.replace("storage/", "");
        }

        return `/storage/${url}`;
    };

    const imageUrl = getImageUrl();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            {/* Imagen de la marca - Mismo estilo que CategoryCard */}
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/placeholder-brand.png";
                            e.target.className =
                                "w-full h-full object-contain p-4";
                        }}
                    />
                ) : (
                    <span className="text-gray-500">Sin imagen</span>
                )}
            </div>

            {/* Contenido de la tarjeta - Mismo estilo que CategoryCard */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {brand.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {brand.description || "Descripción no disponible"}
                </p>

                {showLink && (
                    <Link
                        href={route("brand.show", brand.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Ver productos →
                    </Link>
                )}
            </div>
        </div>
    );
}
