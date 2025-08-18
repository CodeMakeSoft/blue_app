import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "sonner";
import Form from "@/Components/Address/Form";
import Breadcrumb from "@/Components/Breadcrumb";
import { Head, useForm, router } from "@inertiajs/react";

export default function Create({ auth, countries, districts }) {
    const { data, setData, post, processing, errors } = useForm({
        alias: "",
        country_code: "",
        country: "",
        postal_code: "",
        state: "",
        municipality: "",
        city: "",
        district: "",
        neighbourhood: "",
        street: "",
        ext_number: "",
        int_number: "",
        phone: "",
        references: "",
        is_default: false,
        lat: null,
        lng: null,
        zoom: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos a enviar:", data);
        post(route("address.store"), {
            onSuccess: () => {
                toast.success("Dirección creada correctamente");
                router.visit(route("address.index"));
            },
            onError: () => toast.error("Error al crear la dirección"),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            {
                                name: "Mis Direcciones",
                                link: route("address.index"),
                            },
                        ]}
                        currentPage="Nueva Dirección"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                        Nueva Dirección
                    </h1>
                </div>
            }
        >
            <Head title="Crear Dirección" />
            <Toaster position="top-right" richColors />
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <Form
                            data={data}
                            setData={setData}
                            countries={countries}
                            districts={districts}
                            onSubmit={handleSubmit}
                            isEditing={false}
                            errors={errors}
                            processing={processing}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
