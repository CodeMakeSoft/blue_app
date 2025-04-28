import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import RoleFormModal from "@/Components/RoleFormModal";
import ConfirmAdd from "@/Components/ConfirmAdd";
import ConfirmDelete from "@/Components/ConfirmDelete";
import ConfirmEdit from "@/Components/ConfirmEdit";
import AdminLayout from "@/Layouts/AdminLayout";
import { Toaster, toast } from "sonner";
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/Breadcrumb";

export default function Role({ activeRoute, can }) {
    const { roles, permissions } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const openModal = (role = null) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        const roleToDelete = roles.data.find((role) => role.id === id);
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
        router.visit(url);
    };

    return (
        <AdminLayout
            activeRoute={activeRoute}
            header={
                <div>
                    <Breadcrumb
                        routes={[{ name: "Admin", link: route("admin.panel") }]}
                        currentPage="Gestión de Roles"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Roles
                    </h2>
                </div>
            }
        >
            <Head title="Gestión de Roles" />
            <Toaster position="top-right" richColors />
            <div className="card dark:bg-gray-800 dark:text-gray-100">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Gestión de Roles
                </h1>
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        {can.role_create && (
                            <button
                                onClick={() => openModal()}
                                className="flex items-center border border-gray-500 dark:border-gray-600 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600 transition"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add Role
                            </button>
                        )}
                    </div>

                    {/* Vista de tabla para desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse bg-white text-black dark:bg-gray-800 dark:text-gray-100 shadow-sm rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-b">
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
                                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <td className="p-3 font-mono text-sm text-gray-500 dark:text-gray-300">
                                                {role.id}
                                            </td>
                                            <td className="p-3 font-medium dark:text-gray-100">
                                                {role.name}
                                            </td>
                                            <td className="p-3 dark:text-gray-200">
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
                                                            className="flex items-center border border-gray-500 dark:border-gray-600 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600 transition"
                                                        >
                                                            <PencilSquareIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1" />
                                                            Edit
                                                        </button>
                                                    )}
                                                    {can.role_delete && (
                                                        <ConfirmDelete
                                                            id={role.id}
                                                            onConfirm={
                                                                handleDelete
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center p-4 text-gray-600 dark:text-gray-400"
                                        >
                                            No roles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Vista de tarjetas para móvil */}
                    <div className="md:hidden space-y-4">
                        {roles.data.length ? (
                            roles.data.map((role) => (
                                <div
                                    key={role.id}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                >
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                ID
                                            </div>
                                            <div className="font-mono text-sm">
                                                {role.id}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                Name
                                            </div>
                                            <div className="font-medium">
                                                {role.name}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                Permissions
                                            </div>
                                            <div className="text-sm">
                                                {role.permissions
                                                    ?.map((p) => p.name)
                                                    .join(", ") ||
                                                    "No permissions"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-3 border-t">
                                        {can.role_edit && (
                                            <button
                                                onClick={() => openModal(role)}
                                                className="flex items-center border border-gray-500 dark:border-gray-600 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600 transition"
                                            >
                                                <PencilSquareIcon className="h-4 w-4 mr-1" />
                                                Edit
                                            </button>
                                        )}
                                        {can.role_delete && (
                                            <ConfirmDelete
                                                id={role.id}
                                                onConfirm={handleDelete}
                                                className="flex items-center"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-4 text-gray-600 bg-white rounded-lg shadow-sm dark:bg-gray-700 dark:text-gray-400">
                                No roles found.
                            </div>
                        )}
                    </div>

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
