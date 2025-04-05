import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Show({ product }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {product.name}
                </h2>
            }
        >
            <Head title={`Detalle - ${product.name}`} />

            <div className="py-12 flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {product.name}
                            </h3>
                            <p className="text-xl text-gray-700 dark:text-gray-300 mt-2">
                                ${product.price}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-4">
                                {product.description}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Stock: {product.stock}
                            </p>

                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Tiempo de llegada: {product.deliveryTime}
                            </p>
                            <div className="mt-6 flex gap-4">
                                <button className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">
                                    Agregar al carrito
                                </button>
                                <button className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
