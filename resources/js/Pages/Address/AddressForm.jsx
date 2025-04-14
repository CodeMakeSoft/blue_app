import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import Layout from "@/Layouts/AuthenticatedLayout";
import AddressAutocomplete from "@/Components/AddressAutocomplete";

export default function AddressForm({ auth }) {
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        formatted_address: "",
    });

    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post("/addresses", address, {
            onSuccess: () => {
                setAddress({
                    street: "",
                    city: "",
                    state: "",
                    country: "",
                    postal_code: "",
                    formatted_address: "",
                });
            },
            onError: (errors) => {
                console.error("Error saving address:", errors);
            },
        });
    };

    return (
        <Layout auth={auth}>
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                                Agregar Nueva Dirección
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Buscar Dirección
                                    </label>
                                    <AddressAutocomplete
                                        onAddressSelect={handleAddressSelect}
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Comienza a escribir tu dirección y
                                        selecciona una opción
                                    </p>
                                </div>

                                {address.formatted_address && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                        <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                                            Dirección seleccionada:
                                        </h2>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {address.formatted_address}
                                        </p>

                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Calle
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.street}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            street: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Ciudad
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.city}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            city: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Estado/Provincia
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.state}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            state: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Código Postal
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.postal_code}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            postal_code:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    País
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.country}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            country:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!address.formatted_address}
                                        className={`px-4 py-2 rounded-md text-white font-medium ${
                                            address.formatted_address
                                                ? "bg-blue-600 hover:bg-blue-700"
                                                : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                        }`}
                                    >
                                        Guardar Dirección
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
