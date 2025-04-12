import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import UserFormModal from "@/Components/UserFormModal";
import AdminLayout from "@/Layouts/AdminLayout";
import ConfirmAdd from "@/Components/ConfirmAdd";
import ConfirmEdit from "@/Components/ConfirmEdit";
import { Toaster, toast } from "sonner";
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";
import ConfirmDelete from "@/Components/ConfirmDelete";

export default function User({ activeRoute, can }) {
    const { users, roles } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openModal = (user = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };


    const handleDelete = (id) => {
        // Encuentra al usuario que se quiere eliminar
        const userToDelete = users.data.find((user) => user.id === id);

        // Contamos cuántos administradores hay
        const adminCount = users.data.filter((user) =>
            user.roles?.some((role) => role.name === "Admin")
        ).length;

        // Si el usuario a eliminar es un admin, verificamos si hay más de 1 admin
        if (userToDelete?.roles?.some((role) => role.name === "Admin")) {
            if (adminCount <= 1) {
                // Si solo queda un admin, no se permite eliminarlo
                toast.error("Cannot delete the last Admin user");
                return;
            }
        }

        // Si no es el último admin, procedemos con la eliminación
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
        router.visit(url);
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
                                className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add User
                            </button>
                        )}
                    </div>
                    <div className="hidden md:block">
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
                                {users.data.length ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="border-b">
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">
                                                {user.email}
                                            </td>
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
                                                        onClick={() =>
                                                            openModal(user)
                                                        }
                                                        className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
                                                    >
                                                        <PencilSquareIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1" />
                                                        Edit
                                                    </button>
                                                )}
                                                {can.user_delete && (
                                                    <ConfirmDelete
                                                        id={user.id}
                                                        onConfirm={handleDelete}
                                                    />
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
                    </div>

                    <div className="md:hidden">
                        {users.data.length ? (
                            users.data.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white rounded-lg shadow-sm mb-4 p-4"
                                >
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="font-semibold">ID:</div>
                                        <div>{user.id}</div>

                                        <div className="font-semibold">
                                            Name:
                                        </div>
                                        <div>{user.name}</div>

                                        <div className="font-semibold">
                                            Email:
                                        </div>
                                        <div className="break-all overflow-hidden text-ellipsis">
                                            {user.email}
                                        </div> 

                                        <div className="font-semibold">
                                            Phone:
                                        </div>
                                        <div>{user.phone || "N/A"}</div>

                                        <div className="col-span-2">
                                            <div className="text-xs text-gray-500 font-medium">
                                                Roles
                                            </div>
                                            <div className="text-sm">
                                                {user.roles
                                                    ?.map((p) => p.name)
                                                    .join(", ") || "No roles"}
                                            </div>
                                        </div>
                                        <div className="font-semibold">
                                            Verified:
                                        </div>
                                        <div>
                                            {user.email_verified_at ? (
                                                <span className="text-green-600">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                    Not Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2 border-t">
                                        {can.user_edit && (
                                            <button
                                                onClick={() => openModal(user)}
                                                className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
                                            >
                                                <PencilSquareIcon className="h-4 w-4 mr-1" />
                                                Edit
                                            </button>
                                        )}
                                        {can.user_delete && (
                                            <ConfirmDelete
                                                id={user.id}
                                                onConfirm={handleDelete}
                                                className="flex items-center"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-4 text-gray-600 bg-white rounded-lg">
                                No users found
                            </div>
                        )}
                    </div>

                    <Pagination data={users} onPageChange={handlePageChange} />
                </div>
            </div>
            <UserFormModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                user={selectedUser}
                roles={roles}
            />
        </AdminLayout>
    );
}
