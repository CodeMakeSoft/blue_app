import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "sonner";
import Form from "@/Components/Address/Form";
import Breadcrumb from "@/Components/Breadcrumb";
import { Head, useForm, router } from "@inertiajs/react";

export default function Create({ auth, countries, districts }) {
    const { data, setData, post, processing, errors } = useForm({
        alias: "",
        street: "",
        ext_number: "",
        int_number: "",
        postal_code: "",
        district_id: "",
        state: "",
        municipality: "",
        city: "",
        district: "",
        country_id: "",
        phone: "",
        delivery_instructions: "",
        districts: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("address.store"), {
            onSuccess: () => {
                toast.success("Dirección creada");
                router.visit(route("address.index"));
            },
            onError: () => toast.error("Error al crear"),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Dashboard", link: route("dashboard") },
                            { name: "Mi cuenta", link: route("address.index") },
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
