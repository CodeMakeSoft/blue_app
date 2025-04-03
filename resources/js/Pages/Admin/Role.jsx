// resources/js/Pages/Admin/User.jsx
import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import RoleFormModal from "@/components/RoleFormModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Toaster, toast } from "sonner";
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";

export default function Role({ activeRoute, can }) {
    const { roles, permissions } = usePage().props; // users ahora es un objeto paginado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const openModal = (role = null) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        const roleToDelete = roles.data.find((role) => role.id === id);
        //No borrar si es admin
        if (roleToDelete?.name === "Admin") {
            toast.error("Cannot delete Admin role");
            return;
        }

        router.delete(`/admin/roles/${id}`, {
            onSuccess: () => {
                toast.success("Role Deleted Successfully");
                router.reload();
            },
            onError: () => {
                toast.error("Failed to delete Role");
                console.error("Failed to delete Role.");
            },
        });
    };

    const handlePageChange = (url) => {
        router.visit(url); // Navegar a la página seleccionada
    };

    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="Roles" />
            <Toaster position="top-right" richColors />
            <div className="card">
                <div className="card-header">
                    <h2 className="text-xl font-semibold">Roles</h2>
                </div>
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        {can.role_create && (
                            <button
                                onClick={() => openModal()}
                                className="flex items-center bg-green-600 text-white rounded px-4 py-2 text-base hover:bg-green-700 transition"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add Role
                            </button>
                        )}
                    </div>
                     {/* Responsive table*/}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 text-gray-800 border-b">
                                    {[
                                        "ID",
                                        "Name",
                                        "Permissions",
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
                                {roles.data.length ? (
                                    roles.data.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3 font-mono text-sm text-gray-500">
                                                {role.id}
                                            </td>
                                            <td className="p-3 font-medium">
                                                {role.name}
                                            </td>
                                            <td className="p-3">
                                                {role.permissions
                                                    ?.map((p) => p.name)
                                                    .join(", ") ||
                                                    "No permissions"}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    {can.role_edit && (
                                                        <button
                                                            onClick={() =>
                                                                openModal(role)
                                                            }
                                                            className="flex items-center bg-blue-500 text-sm text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                        >
                                                            <PencilSquareIcon className="h-5 w-5 mr-2" />
                                                            Edit
                                                        </button>
                                                    )}
                                                    {can.role_delete && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role.id
                                                                )
                                                            }
                                                            className="flex items-center bg-red-500 text-sm text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                        >
                                                            <TrashIcon className="h-5 w-5 mr-2" />
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center p-4 text-gray-600"
                                        >
                                            No roles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Paginación */}
                    <Pagination data={roles} onPageChange={handlePageChange} />
                </div>
            </div>
            <RoleFormModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                role={selectedRole}
                permissions={permissions}
            />
        </AdminLayout>
    );
}
