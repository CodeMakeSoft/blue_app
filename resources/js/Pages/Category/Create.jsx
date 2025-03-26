import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Form from "@/Components/Category/Form";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Create({ auth }) {
    const { data, setData, errors, post } = useForm({
        name: "",
        description: "",
         new_images: [], // Mantener 'images' para coincidir con el backend
    });

    const submit = (e) => {
        e.preventDefault();

        // Crear FormData para enviar archivos correctamente
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);

        // Añadir imágenes si existen 
         if (data.new_images && data.new_images.length > 0) {
             data.new_images.forEach((file, index) => {
                 formData.append(`new_images[${index}]`, file);
             });
         }

        post(route("category.store"), {
            data: formData,
            preserveScroll: true,
            forceFormData: true, // Importante para archivos
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Category
                    </h2>
                    <Link href={route("category.index")}>Category</Link>
                </div>
            }
        >
            <Head title="Category" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Form
                                data={data}
                                errors={errors}
                                setData={setData}
                                submit={submit}
                                isEdit={false}
                            >
                                <PrimaryButton type="submit">
                                    Crear Categoria
                                </PrimaryButton>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
