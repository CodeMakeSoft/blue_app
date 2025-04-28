import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import ConfirmEdit from "@/Components/ConfirmEdit";
import ConfirmAdd from "@/Components/ConfirmAdd";

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

    const [errors, setErrors] = useState({});
    const [showConfirmEdit, setShowConfirmEdit] = useState(false);
    const [showConfirmAdd, setShowConfirmAdd] = useState(false);
    const permissionsRef = useRef(null);

    // Inicializar datos del formulario
    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name,
                permissions: role.permissions?.map((p) => p.id) || [],
            });
        } else {
            setFormData({
                name: "",
                permissions: [],
            });
        }
        setErrors({});
    }, [role, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
        role ? setShowConfirmEdit(true) : setShowConfirmAdd(true);
    };

    const handleConfirmAction = () => {
        const data = {
            name: formData.name,
            permissions: formData.permissions,
        };

        const url = role ? `/admin/roles/${role.id}` : "/admin/roles";
        const method = role ? "put" : "post";

        router[method](url, data, {
            onSuccess: () => {
                toast.success(
                    `Role ${role ? "updated" : "created"} successfully`
                );
                closeModal();
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error("Please correct the errors in the form");
            },
        });

        role ? setShowConfirmEdit(false) : setShowConfirmAdd(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50">
            {/* Main Form */}
            <div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-2xl 
                w-full max-w-xl max-h-[90vh] overflow-y-auto 
                border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {role ? "Edit Role" : "Create Role"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Role Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Role Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full rounded p-2 
                                bg-white dark:bg-gray-700 
                                text-gray-900 dark:text-gray-100 
                                ${
                                    errors.name
                                        ? "border-red-500 dark:border-red-400"
                                        : "border-gray-300 dark:border-gray-600"
                                }
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                focus:border-transparent transition-colors`}
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Permissions */}
                    <div className="mb-6" ref={permissionsRef}>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Permissions *
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
                                        className="h-4 w-4 text-blue-600 dark:text-blue-500 
                                            rounded border-gray-300 dark:border-gray-600
                                            focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                    <label
                                        htmlFor={`perm-${permission.id}`}
                                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        {permission.name.replace("-", " ")}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                                {errors.permissions}
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
                            {role ? "Update Role" : "Create Role"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Components */}
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
