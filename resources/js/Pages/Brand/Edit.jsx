import React, { useEffect } from "react"; // Añadido useEffect aquí
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import BrandForm from "@/Components/Brand/Form";
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";
import { toast } from "sonner";

export default function Edit({ auth, brand, flash }) {
    const { existingNames } = usePage().props;

    const { data, setData, errors, post, processing, reset } = useForm({
        name: brand?.name || "",
        description: brand?.description || "",
        existing_image: brand?.image || null,
        image: null,
        deleted_image: false,
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handleSubmit = (formData) => {
        post(route("brand.update", brand.id), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => reset("image"),
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
                                name: "Marcas",
                                link: route("brand.index"),
                            },
                        ]}
                        currentPage={`Editar: ${brand.name}`}
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Administración de Marcas
                    </h2>
                </>
            }
        >
            <Head title={`Editar ${brand.name}`} />

            <div className="py-6 px-3 max-w-7xl mx-auto">
                <div className="flex items-center mb-6">
                    <Link
                        href={route("brand.index")}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Volver al listado
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                        Editar Marca: {brand.name}
                    </h1>

                    <BrandForm
                        data={data}
                        errors={errors}
                        setData={setData}
                        submit={handleSubmit}
                        isEdit={true}
                        isSubmitting={processing}
                        existingNames={existingNames}
                    >
                        <div className="flex justify-end space-x-4 mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <Link
                                href={route("brand.index")}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className={
                                    processing
                                        ? "opacity-75 cursor-not-allowed"
                                        : ""
                                }
                            >
                                {processing
                                    ? "Actualizando..."
                                    : "Actualizar Marca"}
                            </PrimaryButton>
                        </div>
                    </BrandForm>
                </div>
            </div>
        </AdminLayout>
    );
}
