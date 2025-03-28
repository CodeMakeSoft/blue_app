// resources/js/Pages/Admin/User.jsx
import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import UserFormModal from "@/components/UserFormModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Toaster, toast } from "sonner";
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";

export default function User({ activeRoute, can }) {
    const { users, roles } = usePage().props; // users ahora es un objeto paginado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openModal = (user = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        router.delete(`/admin/users/${id}`, {
            onSuccess: () => {
                toast.success("User Deleted Successfully");
                router.reload();
            },
            onError: () => {
                toast.error("Failed to delete User");
                console.error("Failed to delete user.");
            },
        });
    };

    const handlePageChange = (url) => {
        router.visit(url); // Navegar a la página seleccionada
    };

    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="Users" />
            <Toaster position="top-right" richColors />
            <div className="card">
                <div className="card-header">
                    <h2 className="text-xl font-semibold">Users</h2>
                </div>
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        {can.user_create && (
                            <button
                                onClick={() => openModal()}
                                className="flex items-center bg-green-600 text-white rounded px-4 py-2 text-base hover:bg-green-700 transition"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add User
                            </button>
                        )}
                    </div>
                    <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800 border-b">
                                {[
                                    "Name",
                                    "Email",
                                    "Phone",
                                    "Roles",
                                    "Verified",
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
                            {users.data.length ? (
                                users.data.map((user) => (
                                    <tr key={user.id} className="border-b">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3">
                                            {user.phone || "N/A"}
                                        </td>
                                        <td className="p-3">
                                            {user.roles
                                                ?.map((role) => role.name)
                                                .join(", ") || "No roles"}
                                        </td>
                                        <td className="p-3">
                                            {user.email_verified_at ? (
                                                <span className="text-green-600">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                    Not Verified
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            {can.user_edit && (
                                                <button
                                                    onClick={() => openModal(user)}
                                                    className="flex items-center bg-blue-500 text-sm text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                            {can.user_delete && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
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
                                        colSpan={6}
                                        className="text-center p-4 text-gray-600"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Paginación */}
                    <Pagination data={users} onPageChange={handlePageChange} />
                </div>
            </div>
            {/*Formulario de edicion y creación*/ }
            <UserFormModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                user={selectedUser}
                roles={roles}
            />
        </AdminLayout>
    );
}
