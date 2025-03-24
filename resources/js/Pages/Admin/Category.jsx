import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import CategoryFormModal from "@/components/CategoryFormModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "sonner";

export default function Category() {
    const { categories } = usePage().props;
    console.log(categories);
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
                toast.success("Failed to delete Category");
                console.error("Failed to delete category.");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Category" />
            <Toaster position="top-right" richColors/>
            <div className="flex flex-col gap-6 p-6 bg-white text-black shadow-lg rounded-xl">
                <div className="flex justify-end">
                    <button
                        onClick={() => openModal()}
                        className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition"
                    >
                        Add Category
                    </button>
                </div>
                <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800 border-b">
                            {[
                                "Picture",
                                "Category",
                                "Description",
                                "Actions",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="border p-3 text-left"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length ? (
                            categories.map((category) => (
                                <tr key={category.id} className="border-b">
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
                                        <button
                                            onClick={() => openModal(category)}
                                            className="bg-blue-500 text-sm text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                            className="bg-red-500 text-sm text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center p-4 text-gray-600"
                                >
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <CategoryFormModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                category={selectedCategory}
            />
        </AuthenticatedLayout>
    );
}
