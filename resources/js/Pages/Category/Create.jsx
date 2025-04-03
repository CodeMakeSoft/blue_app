import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Form from "@/Components/Category/Form";
import PrimaryButton from "@/Components/PrimaryButton";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function Create({ auth }) {
    const { data, setData, errors, post } = useForm({
        name: "",
        description: "",
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        if (data.image) {
            formData.append("image", data.image);
        }

        post(route("category.store"), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Crear Categoría" />

            {/* Contenedor principal con márgenes de 3cm (3rem) */}
            <div className="py-6 px-3">
                    <Link
                        href={route("category.index")}
                        className="inline-flex items-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                    </Link>
                
                <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6 ml-1">
                    Crear Categoría
                </h1>
                {/* Formulario - ya tiene sus márgenes internos */}
                <Form
                    data={data}
                    errors={errors}
                    setData={setData}
                    submit={submit}
                    isEdit={false}
                >
                    {/* Contenedor del botón con margen derecho */}
                    <div className="w-[65%] ml-auto">
                        <div className="flex justify-end">
                            <PrimaryButton type="submit">
                                Crear Categoría
                            </PrimaryButton>
                        </div>
                    </div>
                </Form>
            </div>
        </AuthenticatedLayout>
    );
}
