import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Form from "@/Components/Category/Form"; // Asegúrate de tener este componente
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Edit({ auth, brand }) {
    const { data, setData, errors, post } = useForm({
        name: brand?.name || "",
        description: brand?.description || "",
        existing_image: brand?.image || null, // Cambiado a imagen única
        image: null,
        deleted_image: false,
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("_method", "PUT");

        if (data.image) {
            formData.append("image", data.image);
        }
        if (data.deleted_image) {
            formData.append("deleted_image", true);
        }

        post(route("brand.update", brand.id), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            { name: "Marcas", link: route("brand.index") },
                        ]}
                        currentPage={`Editar: ${brand.name}`}
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Editar Marca
                    </h2>
                </div>
            }
        >
            <Head title="Editar Marca" />

            <div className="py-6 px-3">
                <Link
                    href={route("brand.index")}
                    className="inline-flex items-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6 ml-1">
                    Editar Marca
                </h1>

                <Form
                    data={data}
                    errors={errors}
                    setData={setData}
                    submit={submit}
                    isEdit={true}
                >
                    <div className="w-[65%] ml-auto">
                        <div className="flex justify-end">
                            <PrimaryButton type="submit">
                                Actualizar Marca
                            </PrimaryButton>
                        </div>
                    </div>
                </Form>
            </div>
        </AdminLayout>
    );
}
