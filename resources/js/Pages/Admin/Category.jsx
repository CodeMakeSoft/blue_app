// resources/js/Pages/Admin/Category.jsx
import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import CategoryFormModal from "@/components/CategoryFormModal";
import AdminLayout from "@/Layouts/AdminLayout";
import ConfirmAdd from "@/Components/ConfirmAdd";
import ConfirmEdit from "@/Components/ConfirmEdit";
import ConfirmDelete from "@/Components/ConfirmDelete";
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
                console.error("Failed to delete Category.");
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
                            <ConfirmAdd onConfirm={openModal} label="Agregar Categoría" />
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
                                        className={`p-3 text-left ${
                                            header === "Actions"
                                                ? "text-right-md w-40"
                                                : ""
                                        }`}
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
                                        <td className="p-3">
                                        <div className="flex justify-end gap-2">
                                            {can.category_edit && (
                                                 <ConfirmEdit item={category} onConfirm={openModal} />
                                            )}
                                               {can.category_delete && (
                                                <ConfirmDelete key={category.id} id={category.id} onConfirm={handleDelete} />
                                               )}
                                               </div>
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
