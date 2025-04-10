import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React from "react";
import LocationForm from "@/Components/Address/Form"; // Cambié el nombre a LocationForm para ser más específico

export default function Create({ auth, countries }) {
    const { data, setData, post, processing, errors } = useForm({
        country_id: "",
        alias: "",
        street: "",
        ext_number: "",
        int_number: "",
        postal_code: "",
        state: "",
        municipality: "",
        city: "",
        district: "",
        phone: "",
        delivery_instructions: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("locations.store")); 
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Crear Nueva Dirección
                    </h2>
                    <Link
                        href={route("address.index")} 
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                    >
                        Volver
                    </Link>
                </div>
            }
        >
            <Head title="Crear Dirección" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <LocationForm
                                data={data}
                                errors={errors}
                                setData={setData}
                                submit={handleSubmit}
                                countries={countries} // Pasamos los países como prop
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
