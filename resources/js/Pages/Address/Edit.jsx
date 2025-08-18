import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import Form from "@/Components/Address/Form";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Edit({ auth, location, countries, districts }) {
    const { data, setData, put, processing, errors } = useForm({
        alias: location.alias,
        contact_name: location.contact_name || "",
        contact_phone: location.phone || "",
        street: location.street,
        ext_number: location.ext_number,
        int_number: location.int_number || "",
        neighborhood: location.district || "",
        zip_code: location.postal_code || "",
        city: location.city || "",
        state: location.state || "",
        country: location.country || "",
        references: location.delivery_instructions || "",
        is_default: location.is_default || false,
        districts: districts.filter((d) => d.city === location.city) || [],
    });

    useEffect(() => {
        if (location.district) {
            const initialDistricts = districts.filter(
                (d) => d.city === location.city
            );
            if (initialDistricts.length > 0) {
                setData("districts", initialDistricts);
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("address.update", location.id), {
            onSuccess: () => {
                toast.success("Dirección actualizada correctamente");
                router.visit(route("address.index"));
            },
            onError: () => toast.error("Error al actualizar la dirección"),
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
                        currentPage="Editar Dirección"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                        Editar Dirección
                    </h1>
                </div>
            }
        >
            <Head title="Editar Dirección" />
            <Toaster position="top-right" richColors />
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <Form
                            data={data}
                            setData={setData}
                            errors={errors}
                            countries={countries}
                            districts={districts}
                            isEditing={true}
                            onSubmit={handleSubmit}
                            processing={processing}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
