import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Form from "@/Components/Product/Form";

const Edit = ({ product, categories, brands }) => {
    // Verifica si 'product' tiene los datos correctamente
    console.log(product);

    const { data, errors, setData, put } = useForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        image: null, // Mantén la imagen como null inicialmente
        status: product.status || true,
        category_id: product.category_id || "",
        brand_id: product.brand_id || "",
        stock: product.stock || 0,
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
        put(route("products.update", product.id), formData);
    };

    return (
        <AuthenticatedLayout header={<Head title="Editar Producto" />}>
            <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-lg">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="bg-gray-200 text-gray-600  uppercase text-sm font-semibold px-6 py-3 rounded-t-lg">
                        Editar Producto
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
        </AuthenticatedLayout>
    );
};

export default Edit;
