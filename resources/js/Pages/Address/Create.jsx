import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import Form from "@/Components/Address/Form";
import { router } from "@inertiajs/react";
import Breadcrumb from "@/Components/Breadcrumb";

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
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Nueva Dirección
                    </h1>
                    <Breadcrumb currentPage="Crear" />
                </div>
            }
        >
            <Head title="Crear Dirección" />
            <Toaster position="top-right" richColors />
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
