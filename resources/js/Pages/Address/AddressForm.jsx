import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink, usePage } from "@inertiajs/inertia-react";
import Layout from "@/Layouts/AuthenticatedLayout";
import AddressAutocomplete from "@/Components/AddressAutocomplete";

export default function AddressForm() {
    const { auth } = usePage().props;
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        formatted_address: "",
    });

    const handleAddressSelect = (selectedAddress) => {
        setAddress({
            street: `${selectedAddress.street_number} ${selectedAddress.route}`.trim(),
            city: selectedAddress.locality,
            state: selectedAddress.administrative_area_level_1,
            country: selectedAddress.country,
            postal_code: selectedAddress.postal_code,
            formatted_address: selectedAddress.formatted_address,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post("/addresses", address);
    };

    return (
        <Layout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-bold mb-4">
                                Add New Address
                            </h1>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Search Address
                                    </label>
                                    <AddressAutocomplete
                                        onAddressSelect={handleAddressSelect}
                                    />
                                </div>

                                {/* Display the selected address details */}
                                {address.formatted_address && (
                                    <div className="mb-4 p-4 bg-gray-100 rounded">
                                        <h2 className="font-bold mb-2">
                                            Selected Address:
                                        </h2>
                                        <p>{address.formatted_address}</p>
                                    </div>
                                )}

                                {/* Add more form fields as needed */}
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Save Address
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
