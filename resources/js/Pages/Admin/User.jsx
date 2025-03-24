import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import UserFormModal from "@/components/UserFormModal"; // Asume que tienes un componente para el formulario de usuarios
import AdminLayout from "@/Layouts/AdminLayout";
import { Toaster, toast } from "sonner";

export default function User({ activeRoute }) {
    const { users } = usePage().props;
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
                        <button
                            onClick={() => openModal()}
                            className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition"
                        >
                            Add User
                        </button>
                    </div>
                    <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800 border-b">
                                {[
                                    "Name",
                                    "Email",
                                    "Phone",
                                    "Verified",
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
                            {users.length ? (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3">
                                            {user.phone || "N/A"}
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
                                            <button
                                                onClick={() => openModal(user)}
                                                className="bg-blue-500 text-sm text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
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
                                        colSpan={5}
                                        className="text-center p-4 text-gray-600"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <UserFormModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                user={selectedUser}
            />
        </AdminLayout>
    );
}
