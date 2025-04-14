import React from "react";
import { Link } from "@inertiajs/react";

export default function CategoryCard({ category, showLink = true }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            {/* Imagen de la categoría */}
            <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {category.image ? (
                    <img
                        src={`/storage/${category.image.url}`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-500 dark:text-gray-400">Sin imagen</span>
                )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {category.description}
                </p>

                {showLink && (
                    <Link
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                        Ver productos →
                    </Link>
                )}
            </div>
        </div>
    );
}
