// resources/js/Pages/Brand/Catalog.jsx
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import BrandCard from "@/Components/Brand/BrandCard";

export default function Catalog({ auth, brands = [] }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar marcas por búsqueda
    const filteredBrands = brands.filter((brand) =>
        [brand.name, brand.description || ""].some((text) =>
            text.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Catálogo de Marcas
                </h2>
            }
        >
            <Head title="Catálogo de Marcas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Listado de marcas */}
                    {filteredBrands.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBrands.map((brand) => (
                                <BrandCard
                                    key={brand.id}
                                    brand={brand}
                                    showLink={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {searchTerm
                                    ? "No se encontraron marcas con ese criterio"
                                    : "No hay marcas disponibles"}
                            </p>
                            {!searchTerm && auth.user?.isAdmin && (
                                <Link
                                    href={route("brand.create")}
                                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Crear primera marca
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
