import React, { useMemo, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Form from "@/Components/Category/Form";
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";
import { toast } from "sonner";

export default function Edit({ auth, category, flash }) {
    const { categories } = usePage().props;

    // Cambiamos de put a post en el useForm
    const { data, setData, errors, post, processing, reset } = useForm({
        name: category?.name || "",
        description: category?.description || "",
        parent_id: category?.parent_id || null,
        existing_image: category?.image || null,
        image: null,
        deleted_image: false,
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const preparedCategories = useMemo(() => {
        if (!categories) return [];

        const formatCategory = (category, depth = 0) => ({
            ...category,
            name: `${"— ".repeat(depth)}${category.name}`,
            depth,
        });

        const buildHierarchy = (categories, parentId = null, depth = 0) => {
            return categories
                .filter((category) => category.parent_id === parentId)
                .map((category) => ({
                    ...formatCategory(category, depth),
                    children: buildHierarchy(
                        categories,
                        category.id,
                        depth + 1
                    ),
                }));
        };

        return buildHierarchy(categories);
    }, [categories]);

    const filteredCategories = useMemo(() => {
        const excludeIds = new Set();

        const collectDescendants = (categoryId) => {
            excludeIds.add(categoryId);
            categories
                .filter((cat) => cat.parent_id === categoryId)
                .forEach((cat) => collectDescendants(cat.id));
        };

        if (category?.id) {
            collectDescendants(category.id);
        }

        return preparedCategories.filter((cat) => !excludeIds.has(cat.id));
    }, [preparedCategories, category?.id]);

    const existingNames = useMemo(() => {
        return categories
            ? categories
                  .filter((c) => c.id !== category.id)
                  .map((c) => c.name.toLowerCase())
            : [];
    }, [categories, category.id]);

    // Función modificada para usar POST con spoofing PUT
    const handleSubmit = (formData) => {
        // Aseguramos que el método sea POST pero con _method=PUT
        post(route("category.update", category.id), {
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
                                name: "Categorías",
                                link: route("category.index"),
                            },
                        ]}
                        currentPage="Editar Categoría"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Administración de Categorías
                    </h2>
                </>
            }
        >
            <Head title="Editar Categoría" />

            <div className="py-6 px-3 max-w-7xl mx-auto">
                <div className="flex items-center mb-6">
                    <Link
                        href={route("category.index")}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Volver al listado
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                        Editar Categoría: {category.name}
                    </h1>

                    <Form
                        data={data}
                        errors={errors}
                        setData={setData}
                        submit={handleSubmit}
                        isEdit={true}
                        parentCategories={filteredCategories}
                        existingNames={existingNames}
                        isSubmitting={processing}
                    >
                        <div className="flex justify-end space-x-4 mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <Link
                                href={route("category.index")}
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
                                    : "Actualizar Categoría"}
                            </PrimaryButton>
                        </div>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}
