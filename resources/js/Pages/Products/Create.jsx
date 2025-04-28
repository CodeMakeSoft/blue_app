import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import Form from "@/Components/Product/Form";
import Breadcrumb from "@/Components/Breadcrumb";
import { Link } from "@inertiajs/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

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
        <AdminLayout
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Admin", link: route("admin.panel") },
                            {
                                name: "Productos",
                                link: route("products.index"),
                            },
                        ]}
                        currentPage="Crear Producto"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Productos
                    </h2>
                </div>
            }
        >
            <Head title="Crear Producto" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <Link
                    href={route("products.index")}
                    className="inline-flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4 mb-6 ml-1">
                    Crear Producto
                </h1>
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <div className="px-6 py-3">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    Información del Producto
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Ingresa los detalles del nuevo producto
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
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
            </div>
        </AdminLayout>
    );
};

export default Create;