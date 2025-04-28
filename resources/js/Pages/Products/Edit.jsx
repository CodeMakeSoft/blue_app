import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import Form from "@/Components/Product/Form";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";
import { Link } from "@inertiajs/react";


const Edit = ({ product, categories, brands }) => {
    // Verifica si 'product' tiene los datos correctamente
    console.log(product);

    const { data, errors, setData, post } = useForm({
        name: product.name || "",
        description: product.description || "",
        stock: product.stock || 0,
        price: product.price || "",
        image: [], // Mantén la imagen como null inicialmente
        delete_images: [], // Mantén la imagen como null inicialmente
        status: product.status || true,
        category_id: product.category_id || "",
        brand_id: product.brand_id || "",

        availability: product.availability || "",
        size: product.size || "", // Verifica que se cargue correctamente
        color: product.color || "", // Verifica que se cargue correctamente
    });

    useEffect(() => {
        // Si el producto tiene una imagen, asigna la URL a la imagen (o el objeto si estás trabajando con File)
        if (product.image) {
            setData("image", product.image);
        }
    }, [product, setData]);

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const submit = (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del formulario

        // Crea el FormData con los datos del formulario
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        if (data.image) {
            formData.append("image", data.image);
        }
        formData.append("status", data.status);
        formData.append("category_id", data.category_id);
        formData.append("brand_id", data.brand_id);
        formData.append("stock", data.stock);
        formData.append("availability", data.availability);
        formData.append("size", data.size); // Asegúrate de que 'size' se agregue correctamente
        formData.append("color", data.color); // Asegúrate de que 'color' se agregue correctamente

        // Realiza la petición PUT para editar el producto
        post(route("products.update", product.id), formData);
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
                        currentPage={`Editar: ${product.name}`}
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Productos
                    </h2>
                </div>
            }
        >
            <Head title={`Editar: ${product.name}`} />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <Link
                    href={route("products.index")}
                    className="inline-flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4 mb-6 ml-1">
                    Actualizar Producto
                </h1>
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <div className="px-6 py-3">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    Información del Producto
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Actualiza los detalles del producto
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

export default Edit;