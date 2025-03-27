// resources/js/Pages/Admin/Category.jsx
import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import CategoryFormModal from "@/components/CategoryFormModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Toaster, toast } from "sonner";
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";

export default function Category({ activeRoute, can}) {
    const { categories } = usePage().props; // categories ahora es un objeto paginado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const openModal = (category = null) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        router.delete(`/admin/categories/${id}`, {
            onSuccess: () => {
                toast.success("Category Deleted Successfully");
                router.reload();
            },
            onError: () => {
                toast.error("Failed to delete Category");
                console.error("Failed to delete category.");
            },
        });
    };

    const handlePageChange = (url) => {
        router.visit(url); // Navegar a la página seleccionada
    };

    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="Category" />
            <Toaster position="top-right" richColors />
            <div className="card">
                <div className="card-header">
                    <h2 className="text-xl font-semibold">Categories</h2>
                </div>
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        {can.category_create && (
                            <button
                                onClick={() => openModal()}
                                className="flex items-center bg-green-600 text-white rounded px-4 py-2 text-base hover:bg-green-700 transition"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add Category
                            </button>
                        )}
                    </div>
                    <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800">
                                {[
                                    "Picture",
                                    "Category",
                                    "Description",
                                    "Actions",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="p-3 text-left first:rounded-tl-lg last:rounded-tr-lg"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.length ? (
                                categories.data.map((category, index) => (
                                    <tr
                                        key={category.id}
                                        className={`border-t ${
                                            index === categories.data.length - 1
                                                ? "last:rounded-b-lg"
                                                : ""
                                        }`}
                                    >
                                        <td className="p-3">
                                            {category.picture ? (
                                                <img
                                                    src={category.picture}
                                                    alt="Category"
                                                    className="w-16 h-16 object-cover rounded-full"
                                                />
                                            ) : (
                                                "No Picture"
                                            )}
                                        </td>
                                        <td className="p-3">{category.name}</td>
                                        <td className="p-3">
                                            {category.description}
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            {can.category_edit && (
                                                <button
                                                    onClick={() =>
                                                        openModal(category)
                                                    }
                                                    className="flex items-center bg-blue-500 text-sm text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                            {can.category_delete && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(category.id)
                                                    }
                                                    className="flex items-center bg-red-500 text-sm text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                >
                                                    <TrashIcon className="h-5 w-5 mr-2" />
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center p-4 text-gray-600 rounded-b-lg"
                                    >
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Paginación */}
                    <Pagination
                        data={categories}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <CategoryFormModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                category={selectedCategory}
            />
        </AdminLayout>
    );
}
