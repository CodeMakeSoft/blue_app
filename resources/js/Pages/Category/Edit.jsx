import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Form from "@/Components/Category/Form";
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Edit({ auth, category }) {
    const { data, setData, errors, post } = useForm({
        name: category?.name || "",
        description: category?.description || "",
        existing_image: category?.image || null,
        image: null,
        deleted_image: false,
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("_method", "PUT"); // Para método POST que simula PUT

        if (data.image) {
            formData.append("image", data.image);
        }
        if (data.deleted_image) {
            formData.append("deleted_image", true);
        }

        post(route("category.update", category.id), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            {
                                name: "Categorías",
                                link: route("category.index"),
                            },
                        ]}
                        currentPage="Actualizar Categoría"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Categorias
                    </h2>
                </>
            }
        >
            <Head title="Crear Categoría" />

            {/* Contenedor principal con márgenes de 3cm (3rem) */}
            <div className="py-6 px-3">
                <Link
                    href={route("category.index")}
                    className="inline-flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4 mb-6 ml-1">
                    Actualizar Categoría
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
                                Actualizar Categoría
                            </PrimaryButton>
                        </div>
                    </div>
                </Form>
            </div>
        </AdminLayout>
    );
}