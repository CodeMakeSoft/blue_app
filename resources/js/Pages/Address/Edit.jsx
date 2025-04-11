import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import Form from "@/Components/Address/Form";

export default function Edit({ auth, countries, districts, location }) {
    const { data, setData, put } = useForm({
        country_id: location.country_id || "",
        alias: location.alias || "",
        street: location.street || "",
        ext_number: location.ext_number || "",
        int_number: location.int_number || "",
        postal_code: location.postal_code || "",
        district_id: location.district_id || "",
        state: location.state || "",
        municipality: location.municipality || "",
        city: location.city || "",
        district: location.district || "",
        phone: location.phone || "",
        delivery_instructions: location.delivery_instructions || "",
        districts: [], // Esto se llena después según el código postal
    });

    // Pre-cargar distritos si hay un código postal válido
    useEffect(() => {
        const matchingDistricts = districts.filter(
            (d) => d.postal_code === location.postal_code
        );
        if (matchingDistricts.length > 0) {
            setData("districts", matchingDistricts);
        }
    }, [districts, location.postal_code, setData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("address.update", location.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Editar Dirección
                    </h2>
                </div>
            }
        >
            <Head title="Editar Dirección" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Form
                                data={data}
                                setData={setData}
                                countries={countries}
                                districts={districts}
                                onSubmit={handleSubmit}
                                isEditing={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
