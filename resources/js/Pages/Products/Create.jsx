import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Form from "@/Components/Product/Form";

const Create = ({ categories, brands }) => {
    const { data, errors, setData, post } = useForm({
        name: "",
        description: "",
        price: "",
        image: null,
        status: true,
        category_id: "",
        brand_id: "",
        stock: 0,
        availability: "",
        size: "",
        color: "",
    });

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("image", data.image);
        formData.append("status", data.status);
        formData.append("category_id", data.category_id);
        formData.append("brand_id", data.brand_id);
        formData.append("stock", data.stock);
        formData.append("availability", data.availability);
        formData.append("size", data.size);
        formData.append("color", data.color);

        post(route("products.store"), formData);
    };

    return (
        <AuthenticatedLayout header={<Head title="Crear Producto" />}>
            <div className="max-w-5xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm font-semibold px-6 py-3 rounded-t-lg">
                        Crear Producto
                    </div>
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <Form
                            data={data}
                            setData={setData}
                            errors={errors}
                            categories={categories}
                            brands={brands}
                            handleFileChange={handleFileChange}
                            submit={submit}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
