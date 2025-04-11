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
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    toast.error(
                        "Por favor corrige los errores en el formulario"
                    );
                } else {
                    toast.error("Error al crear la dirección");
                }
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Crear Nueva Dirección
                </h2>
            }
        >
            <Head title="Crear Dirección" />

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
