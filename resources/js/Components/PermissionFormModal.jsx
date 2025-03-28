import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

export default function PermissionFormModal({
    isOpen,
    closeModal,
    permission,
}) {
    const [formData, setFormData] = useState({
        name: "",
    });

    // Actualiza el estado cuando el permiso cambia
    useEffect(() => {
        if (permission) {
            setFormData({
                name: permission.name,
            });
        } else {
            setFormData({ name: "" });
        }
    }, [permission]);

    // Maneja cambios en los campos del formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const successMessage = permission?.id
            ? "Permission updated successfully"
            : "Permission created successfully";

        const errorMessage = permission?.id
            ? "Failed to update permission"
            : "Failed to create permission";

        if (permission?.id) {
            // Actualización de permiso existente
            router.put(`/admin/permissions/${permission.id}`, formData, {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    toast.error(errorMessage);
                    console.error(
                        errors.message || "Failed to submit permission"
                    );
                },
            });
        } else {
            // Creación de nuevo permiso
            router.post("/admin/permissions", formData, {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    toast.error(errorMessage);
                    console.error(
                        errors.message || "Failed to create permission"
                    );
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                    {permission ? "Edit Permission" : "Create Permission"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Permission Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Ej: user-create"
                            required
                            pattern="[a-z-]+"
                            title="Use only lowercase letters and hyphens"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use lowercase with hyphens (ej: permission-edit)
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            {permission ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
