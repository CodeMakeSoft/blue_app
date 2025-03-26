import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export default function UserFormModal({ isOpen, closeModal, user, roles }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        roles: [],
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Inicializar datos del formulario
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                password: "",
                password_confirmation: "",
                roles: user.roles?.map((r) => r.id) || [],
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                password_confirmation: "",
                roles: [],
            });
        }
        setErrors({});
    }, [user, isOpen]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsRolesOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (roleId) => {
        setFormData((prev) => ({
            ...prev,
            roles: prev.roles.includes(roleId)
                ? prev.roles.filter((id) => id !== roleId)
                : [...prev.roles, roleId],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            roles: formData.roles,
        };

        const url = user ? `/admin/users/${user.id}` : "/admin/users";
        const method = user ? "put" : "post";

        router[method](url, data, {
            onSuccess: () => {
                toast.success(
                    `User ${user ? "updated" : "created"} successfully`
                );
                closeModal();
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error("Please correct the errors in the form");
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">
                    {user ? "Edit User" : "Create User"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${
                                errors.phone
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            {user ? "New Password" : "Password *"}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required={!user}
                            minLength={8}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirmar contraseña*/}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Confirm {user ? "New " : ""}Password *
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className={`w-full border rounded p-2 ${
                                errors.password_confirmation
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required={!user}
                        />
                    </div>

                    {/* Menu de roles */}
                    <div className="mb-6 relative" ref={dropdownRef}>
                        {" "}
                        {/* Añadido relative aquí */}
                        <label className="block text-sm font-medium mb-2">
                            Roles *
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsRolesOpen(!isRolesOpen)}
                            className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="truncate">
                                {formData.roles.length > 0
                                    ? roles
                                          .filter((r) =>
                                              formData.roles.includes(r.id)
                                          )
                                          .map((r) => r.name.replace("-", " "))
                                          .join(", ")
                                    : "Select roles"}
                            </span>
                            <svg
                                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                                    isRolesOpen ? "transform rotate-180" : ""
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        {isRolesOpen && (
                            <div
                                className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-y-auto"
                                style={{
                                    maxHeight: "200px", // Altura máxima ajustable
                                    width: "calc(100% - 1.5rem)", // Ajuste para no salirse
                                }}
                            >
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        onClick={() =>
                                            handleRoleChange(role.id)
                                        }
                                        className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center ${
                                            formData.roles.includes(role.id)
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.roles.includes(
                                                role.id
                                            )}
                                            readOnly
                                            className="h-4 w-4 text-blue-600 rounded mr-2"
                                        />
                                        <span className="capitalize">
                                            {role.name.replace("-", " ")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Tags de roles seleccionados */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.roles.map((roleId) => {
                                const role = roles.find((r) => r.id === roleId);
                                return role ? (
                                    <span
                                        key={roleId}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {role.name.replace("-", " ")}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRoleChange(roleId);
                                            }}
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                                        >
                                            <span className="sr-only">
                                                Remove
                                            </span>
                                            <svg
                                                className="w-2 h-2"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 8 8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="1.5"
                                                    d="M1 1l6 6m0-6L1 7"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                ) : null;
                            })}
                        </div>
                        {errors.roles && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.roles}
                            </p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            {user ? "Update User" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
