import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import Form from "@/Components/Address/Form";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Edit({ auth, location, countries, districts }) {
    const { data, setData, put, processing, errors } = useForm({
        alias: location.alias,
        street: location.street,
        ext_number: location.ext_number,
        int_number: location.int_number || "",
        postal_code: location.district?.postal_code || "",
        district_id: location.district_id,
        phone: location.phone || "",
        delivery_instructions: location.delivery_instructions || "",
        districts:
            districts.filter(
                (d) => d.postal_code === location.district?.postal_code
            ) || [],
        state: location.district?.city?.municipality?.state?.name || "",
        municipality: location.district?.city?.municipality?.name || "",
        city: location.district?.city?.name || "",
        country:
            location.district?.city?.municipality?.state?.country?.name || "",
    });

    useEffect(() => {
        if (location.district?.postal_code) {
            const initialDistricts = districts.filter(
                (d) => d.postal_code === location.district.postal_code
            );
            if (initialDistricts.length > 0) {
                setData("districts", initialDistricts);
                setShowPostalData(true);
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("address.update", location.id), data, {
            onSuccess: () =>
                toast.success("Dirección actualizada exitosamente"),
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
                            { name: "Mis Direcciones", link: route("address.index") },
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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
            </div>
        </AuthenticatedLayout>
    );
}
