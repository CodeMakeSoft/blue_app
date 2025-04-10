import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ConfirmAdd from "@/Components/ConfirmAdd";
import ConfirmEdit from "@/Components/ConfirmEdit";
import ConfirmDelete from "@/Components/ConfirmDelete";
import { Toaster, toast } from "sonner";
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import PermissionFormModal from "@/Components/PermissionFormModal";
import Pagination from "@/Components/Pagination";

export default function Permission({ activeRoute, can }) {
    const { permissions } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);

    const openModal = (permission = null) => {
        setSelectedPermission(permission);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        router.delete(`/admin/permissions/${id}`, {
            onSuccess: () => {
                toast.success("Permission Deleted Successfully");
                router.reload();
            },
            onError: () => {
                toast.error("Failed to delete Permission");
                console.error("Failed to delete Permission.");
            },
        });
    };

    const handlePageChange = (url) => {
        router.visit(url);
    };

    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="Permissions" />
            <Toaster position="top-right" richColors />

            <div className="card">
                <div className="card-header">
                    <h2 className="text-xl font-semibold">Permissions</h2>
                </div>
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        {can.permission_create && (
                            <button
                                onClick={() => openModal()}
                                className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add Permission
                            </button>
                        )}
                    </div>

                    {/* Versión para desktop */}
                    <div className="hidden md:block">
                        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 text-gray-800">
                                    {["ID", "Name", "Guard", "Actions"].map(
                                        (header) => (
                                            <th
                                                key={header}
                                                className={`p-3 text-left ${
                                                    header === "Actions"
                                                        ? "text-right w-40"
                                                        : ""
                                                }`}
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
                                            <td className="p-3">
                                                {permission.id}
                                            </td>
                                            <td className="p-3">
                                                {permission.name}
                                            </td>
                                            <td className="p-3">
                                                {permission.guard_name}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    {can.permission_edit && (
                                                        <button
                                                            onClick={() =>
                                                                openModal(
                                                                    permission
                                                                )
                                                            }
                                                            className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
                                                        >
                                                            <PencilSquareIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1" />
                                                            Edit
                                                        </button>
                                                    )}
                                                    {can.permission_delete && (
                                                        <ConfirmDelete
                                                            id={permission.id}
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
                                            className="text-center p-4 text-gray-600"
                                        >
                                            No permissions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Versión para móvil */}
                    <div className="md:hidden">
                        {permissions.data.length ? (
                            permissions.data.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="bg-white rounded-lg shadow-sm mb-4 p-4"
                                >
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="font-semibold">ID:</div>
                                        <div>{permission.id}</div>

                                        <div className="font-semibold">
                                            Name:
                                        </div>
                                        <div>{permission.name}</div>

                                        <div className="font-semibold">
                                            Guard:
                                        </div>
                                        <div>{permission.guard_name}</div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t">
                                        {can.permission_edit && (
                                            <button
                                                onClick={() =>
                                                    openModal(permission)
                                                }
                                                className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
                                            >
                                                <PencilSquareIcon className="h-4 w-4 mr-1" />
                                                Edit
                                            </button>
                                        )}
                                        {can.permission_delete && (
                                            <ConfirmDelete
                                                id={permission.id}
                                                onConfirm={handleDelete}
                                                className="flex items-center"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-4 text-gray-600 bg-white rounded-lg">
                                No permissions found
                            </div>
                        )}
                    </div>

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
