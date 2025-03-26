import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React from "react";
import Form from "@/Components/Category/Form";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Create(auth) {
    
    const initialValues = {
        name: "",
        description: "",
        images: [],
    };

    const { data, errors, setData, post } = useForm(initialValues);

     const handleImageChange = (e) => {
         const files = Array.from(e.target.files);
         setData("images", files);
     };

    const submit = (e) => {
        e.preventDefault();
        post(route("category.store"), data);
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
                                handleImageChange={handleImageChange} 
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
