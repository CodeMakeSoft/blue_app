import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import Form from "@/Components/Address/Form";

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
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Dirección creada exitosamente");
            },
            onError: () => {
                toast.error("Error al crear la dirección");
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Crear Nueva Dirección
                    </h2>
                </div>
            }
        >
            <Head title="Crear Dirección" />

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
                                isEditing={false}
                                errors={errors}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
