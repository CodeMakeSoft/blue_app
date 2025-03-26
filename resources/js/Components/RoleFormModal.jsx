import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export default function RoleFormModal({
    isOpen,
    closeModal,
    role,
    permissions,
}) {
    const [formData, setFormData] = useState({
        name: "",
        permissions: [],
    });

    // Inicializar con datos del rol si existe
    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name,
                permissions: role.permissions?.map((p) => p.id) || [],
            });
        } else {
            setFormData({ name: "", permissions: [] });
        }
    }, [role]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePermissionChange = (permissionId) => {
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter((id) => id !== permissionId)
                : [...prev.permissions, permissionId],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: formData.name,
            permissions: formData.permissions,
        };

        if (role?.id) {
            router.put(`/admin/roles/${role.id}`, data, {
                onSuccess: () => {
                    toast.success("Role updated successfully");
                    closeModal();
                },
            });
        } else {
            router.post("/admin/roles", data, {
                onSuccess: () => {
                    toast.success("Role created successfully");
                    closeModal();
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">
                    {role ? "Edit Role" : "Create Role"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Role Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Permissions
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id={`perm-${permission.id}`}
                                        checked={formData.permissions.includes(
                                            permission.id
                                        )}
                                        onChange={() =>
                                            handlePermissionChange(
                                                permission.id
                                            )
                                        }
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label
                                        htmlFor={`perm-${permission.id}`}
                                        className="ml-2 text-sm"
                                    >
                                        {permission.name.replace("-", " ")}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            {role ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
