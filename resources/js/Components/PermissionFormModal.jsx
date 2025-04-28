import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import ConfirmEdit from "@/Components/ConfirmEdit";
import ConfirmAdd from "@/Components/ConfirmAdd";

export default function PermissionFormModal({
    isOpen,
    closeModal,
    permission,
}) {
    const [formData, setFormData] = useState({
        name: "",
    });

    const [errors, setErrors] = useState({});
    const [showConfirmEdit, setShowConfirmEdit] = useState(false);
    const [showConfirmAdd, setShowConfirmAdd] = useState(false);

    // Inicializar datos del formulario
    useEffect(() => {
        if (permission) {
            setFormData({
                name: permission.name,
            });
        } else {
            setFormData({
                name: "",
            });
        }
        setErrors({});
    }, [permission, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        permission ? setShowConfirmEdit(true) : setShowConfirmAdd(true);
    };

    const handleConfirmAction = () => {
        const data = {
            name: formData.name,
        };

        const url = permission
            ? `/admin/permissions/${permission.id}`
            : "/admin/permissions";
        const method = permission ? "put" : "post";

        router[method](url, data, {
            onSuccess: () => {
                toast.success(
                    `Permission ${
                        permission ? "updated" : "created"
                    } successfully`
                );
                closeModal();
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error("Please correct the errors in the form");
            },
        });

        permission ? setShowConfirmEdit(false) : setShowConfirmAdd(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50">
            {/* Formulario principal */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-2xl 
                w-full max-w-md max-h-[90vh] overflow-y-auto 
                border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {permission ? "Edit Permission" : "Create Permission"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Nombre del Permiso */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Permission Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full rounded p-2 
                                bg-white dark:bg-gray-700 
                                text-gray-900 dark:text-gray-100 
                                ${errors.name 
                                    ? "border-red-500 dark:border-red-400" 
                                    : "border-gray-300 dark:border-gray-600"
                                }
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                focus:border-transparent transition-colors`}
                            placeholder="Ej: user-create"
                            required
                            pattern="[a-z-]+"
                            title="Use only lowercase letters and hyphens"
                        />
                        {errors.name ? (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                                {errors.name}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Use lowercase with hyphens (ej: permission-edit)
                            </p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 
                                text-gray-700 dark:text-gray-300 
                                rounded hover:bg-gray-400 dark:hover:bg-gray-600 
                                transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 
                                text-white rounded 
                                hover:bg-blue-700 dark:hover:bg-blue-600 
                                transition-colors duration-200"
                        >
                            {permission ? "Update Permission" : "Create Permission"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Componentes de confirmación */}
            <ConfirmEdit
                isOpen={showConfirmEdit}
                onConfirm={handleConfirmAction}
                onCancel={() => setShowConfirmEdit(false)}
            />

            <ConfirmAdd
                isOpen={showConfirmAdd}
                onConfirm={handleConfirmAction}
                onCancel={() => setShowConfirmAdd(false)}
            />
        </div>
    );
}
