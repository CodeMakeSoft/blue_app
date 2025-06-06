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
import Breadcrumb from "@/Components/Breadcrumb";

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
        <AdminLayout
            activeRoute={activeRoute}
            header={
                <div>
                    <Breadcrumb
                        routes={[{ name: "Admin", link: route("admin.panel") }]}
                        currentPage="Gestión de Permisos"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                        Permisos
                    </h2>
                </div>
            }
        >
            <Head title="Gestión de Permisos" />
            <Toaster position="top-right" richColors />

            <div className="card bg-white dark:bg-gray-800">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Gestión de Permisos
                </h1>
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        {can.permission_create && (
                            <button
                                onClick={() => openModal()}
                                className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add Permission
                            </button>
                        )}
                    </div>

                    {/* Versión para desktop */}
                    <div className="hidden md:block">
                        <table className="w-full border-collapse bg-white text-black dark:bg-gray-700 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300">
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
                                            className="border-t dark:bg-gray-800"
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
                                                            className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition"
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
                                            className="text-center p-4 text-gray-600 dark:text-gray-400"
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
                                    className="bg-white rounded-lg shadow-sm mb-4 p-4 dark:bg-gray-700 dark:text-gray-200"
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

                                    <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-600">
                                        {can.permission_edit && (
                                            <button
                                                onClick={() =>
                                                    openModal(permission)
                                                }
                                                className="flex items-center border border-gray-500 bg-white text-gray-600 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition"
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
                            <div className="text-center p-4 text-gray-600 bg-white rounded-lg dark:text-gray-400 dark:bg-gray-700">
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
