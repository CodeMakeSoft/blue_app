import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Form from "@/Components/Category/Form";
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";
import { useMemo } from "react";

export default function Create({ auth }) {
    // Obtener las categorías disponibles del backend
    const { categories } = usePage().props;

    // Preparar datos del formulario
    const { data, setData, errors, post, processing } = useForm({
        name: "",
        description: "",
        parent_id: null,
        image: null,
    });

    // Función para enviar el formulario
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("parent_id", data.parent_id || ""); // Asegurar valor válido

        if (data.image) {
            formData.append("image", data.image);
        }

        post(route("category.store"), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Resetear campos después de crear
                setData({
                    name: "",
                    description: "",
                    parent_id: null,
                    image: null,
                });
            },
        });
    };

    // Preparar categorías para el selector
    const preparedCategories = useMemo(() => {
        if (!categories) return [];

        // Función recursiva para formatear categorías con hijos
        const formatCategories = (categories, level = 0) => {
            return categories.map((category) => ({
                ...category,
                name: `${"— ".repeat(level)}${category.name}`,
                children: category.children
                    ? formatCategories(category.children, level + 1)
                    : [],
            }));
        };

        return formatCategories(categories);
    }, [categories]);

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
                        currentPage="Crear Categoría"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Administración de Categorías
                    </h2>
                </>
            }
        >
            <Head title="Crear Categoría" />

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
                        Crear Nueva Categoría
                    </h1>

                    <Form
                        data={data}
                        errors={errors}
                        setData={setData}
                        submit={submit}
                        isEdit={false}
                        parentCategories={preparedCategories}
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
                                className={`${
                                    processing
                                        ? "opacity-75 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {processing ? "Creando..." : "Crear Categoría"}
                            </PrimaryButton>
                        </div>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}
