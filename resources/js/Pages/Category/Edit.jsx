import React, { useMemo } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Form from "@/Components/Category/Form";
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Edit({ auth, category }) {
    const { categories } = usePage().props;

    const { data, setData, errors, post, processing } = useForm({
        name: category?.name || "",
        description: category?.description || "",
        parent_id: category?.parent_id || null,
        existing_image: category?.image || null,
        image: null,
        deleted_image: false,
    });

    // Preparar categorías en estructura jerárquica
    const preparedCategories = useMemo(() => {
        if (!categories) return [];

        const categoryMap = {};
        categories.forEach((cat) => {
            categoryMap[cat.id] = { ...cat, children: [] };
        });

        const hierarchy = [];
        categories.forEach((cat) => {
            if (cat.parent_id && categoryMap[cat.parent_id]) {
                categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
            } else {
                hierarchy.push(categoryMap[cat.id]);
            }
        });

        return hierarchy;
    }, [categories]);

    const existingNames = useMemo(() => {
        return categories
            ? categories
                  .filter((c) => c.id !== category.id)
                  .map((c) => c.name.toLowerCase())
            : [];
    }, [categories, category.id]);

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("_method", "PUT"); // Esto simula un método PUT

        if (data.parent_id) {
            formData.append("parent_id", data.parent_id);
        }
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
            <Head title="Actualizar Categoría" />

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
                    parentCategories={preparedCategories}
                    existingNames={existingNames}
                    isSubmitting={processing}
                >
                    <div className="w-[65%] ml-auto">
                        <div className="flex justify-end">
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing
                                    ? "Actualizando..."
                                    : "Actualizar Categoría"}
                            </PrimaryButton>
                        </div>
                    </div>
                </Form>
            </div>
        </AdminLayout>
    );
}
