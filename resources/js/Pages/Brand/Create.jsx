import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import BrandForm from "@/Components/Brand/Form";
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Create({ auth }) {
    const { existingNames } = usePage().props;

    const { data, setData, errors, post, processing } = useForm({
        name: "",
        description: "",
        image: null,
        deleted_image: false,
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("deleted_image", data.deleted_image);

        if (data.image) {
            formData.append("image", data.image);
        }

        post(route("brand.store"), {
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
                                name: "Marcas",
                                link: route("brand.index"),
                            },
                        ]}
                        currentPage="Crear Marca"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Administración de Marcas
                    </h2>
                </>
            }
        >
            <Head title="Crear Marca" />

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
                        Crear Nueva Marca
                    </h1>

                    <BrandForm
                        data={data}
                        errors={errors}
                        setData={setData}
                        submit={submit}
                        isEdit={false}
                        isSubmitting={processing}
                        existingNames={existingNames}
                    >
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className={`${
                                processing
                                    ? "opacity-75 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {processing ? "Creando..." : "Crear Marca"}
                        </PrimaryButton>
                    </BrandForm>
                </div>
            </div>
        </AdminLayout>
    );
}
