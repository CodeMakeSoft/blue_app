import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Form from "@/Components/Brand/Form";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Edit({ auth, brand }) {
    const { data, setData, errors, post } = useForm({
        name: brand?.name || "",
        description: brand?.description || "",
        existing_images: brand?.images || [],
        new_images: [],
        deleted_images: [],
    });

    const submit = (e) => {
        e.preventDefault();

        if (!data.name || !data.description) {
            console.log("Los campos nombre y descripción son obligatorios");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);

        // Agregar imágenes existentes que se mantienen
        data.existing_images.forEach((image, index) => {
            formData.append(`existing_images[${index}]`, image.id);
        });

        // Agregar nuevas imágenes
        if (data.new_images && data.new_images.length > 0) {
            data.new_images.forEach((file, index) => {
                formData.append(`new_images[${index}]`, file);
            });
        }

        // Agregar imágenes eliminadas
        if (data.deleted_images && data.deleted_images.length > 0) {
            data.deleted_images.forEach((id, index) => {
                formData.append(`deleted_images[${index}]`, id);
            });
        }

        post(route("brand.update", brand.id), {
            data: formData,
            preserveScroll: true,
            forceFormData: true, // Esto es importante para enviar FormData correctamente
            onSuccess: () => console.log("Marca actualizada"),
            onError: (err) => console.log("Error al actualizar:", err),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Actualizar Marca
                    </h2>
                    <Link href={route("brand.index")}>Lista de Marcas</Link>
                </div>
            }
        >
            <Head title="Brands" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Form
                                data={data}
                                errors={errors}
                                setData={setData}
                                submit={submit}
                                isEdit={true}
                            >
                                <PrimaryButton type="submit">
                                    Actualizar Marca
                                </PrimaryButton>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
