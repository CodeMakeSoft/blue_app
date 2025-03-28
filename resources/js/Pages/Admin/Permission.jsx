import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Toaster, toast } from "sonner";
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import PermissionFormModal from "@/Components/PermissionFormModal";
import Pagination from "@/Components/Pagination";

export default function Permission({ activeRoute }) {
    const { permissions } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);

    const openModal = (permission = null) => {
        setSelectedPermission(permission);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        router.delete(`/admin/permissions/${id}`, {
            onSuccess: () => toast.success("Permission deleted successfully"),
            onError: () => toast.error("Failed to delete permission"),
        });
    };

    const handlePageChange = (url) => {
            router.visit(url); // Navegar a la página seleccionada
        };

    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="Permissions Management" />
            <Toaster position="top-right" richColors />

            <div className="card">
                <div className="card-header">
                    <h2 className="text-xl font-semibold">Permissions</h2>
                </div>
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => openModal()}
                            className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Add Permission
                        </button>
                    </div>

                    <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800">
                                {["ID", "Name", "Guard", "Actions"].map(
                                    (header) => (
                                        <th
                                            key={header}
                                            className="p-3 text-left"
                                        >
                                            {header}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.data.length ? (
                                permissions.data.map((permission) => (
                                    <tr
                                        key={permission.id}
                                        className="border-t"
                                    >
                                        <td className="p-3">{permission.id}</td>
                                        <td className="p-3">
                                            {permission.name}
                                        </td>
                                        <td className="p-3">
                                            {permission.guard_name}
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openModal(permission)
                                                }
                                                className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                            >
                                                <PencilSquareIcon className="h-4 w-4 mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(permission.id)
                                                }
                                                className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                            >
                                                <TrashIcon className="h-4 w-4 mr-1" />
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
                                        No permissions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination
                        data={permissions}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <PermissionFormModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                permission={selectedPermission}
            />
        </AdminLayout>
    );
}
