import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import ConfirmEdit from "@/Components/ConfirmEdit";
import ConfirmAdd from "@/Components/ConfirmAdd";
export default function UserFormModal({ isOpen, closeModal, user, roles, users }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        roles: [],
        password_confirmation: "",
        email_verified_at: null, // <- nuevo campo
    });

    const [errors, setErrors] = useState({});
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const [showConfirmEdit, setShowConfirmEdit] = useState(false);
    const [showConfirmAdd, setShowConfirmAdd] = useState(false);
    const dropdownRef = useRef(null);
        const isLastAdmin = () => {
            const adminCount = users.data.filter((u) =>
                u.roles?.some((r) => r.name === "Admin")
            ).length;
    
            return (
                user &&
                user.roles?.some((r) => r.name === "Admin") &&
                adminCount <= 1
            );
        };
    
        const disableRoleDropdown = isLastAdmin();    
    

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
                email_verified_at: user.email_verified_at,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                password_confirmation: "",
                roles: [],
                email_verified_at: null,
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

    const handleRoleSelect = (roleId) => {
        setFormData((prev) => ({
            ...prev,
            roles: roleId ? [roleId] : [],
        }));
        setIsRolesOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Limpiar errores anteriores
        setErrors({});
    
        // Validación de coincidencia de contraseña
        if (formData.password && formData.password !== formData.password_confirmation) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password_confirmation: "Passwords do not match",
            }));
            return;
        }
    
        // Validación de mínimo 8 caracteres si el usuario escribió una nueva contraseña
        if (formData.password && formData.password.length < 8) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: "Password must be at least 8 characters",
            }));
            return;
        }
        // Si todo está bien, mostrar modal de confirmación
        user ? setShowConfirmEdit(true) : setShowConfirmAdd(true);
    };
    

    const handleConfirmAction = () => {
        const data = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            roles: formData.roles,
            email_verified_at: formData.email_verified_at,
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

        user ? setShowConfirmEdit(false) : setShowConfirmAdd(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Formulario principal */}
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
                    <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-medium mb-1">
                   <input
                    type="checkbox"
                    checked={!!formData.email_verified_at}
                    onChange={(e) => {
                    setFormData((prev) => ({
                    ...prev,
                    email_verified_at: e.target.checked
                        ? new Date().toISOString()
                        : null,
                     }));
                 }}
                 />
                   Email Verified
                </label>
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
                            autoComplete="new-password"
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
                            required={!user&& !!formData.password}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                    {/* Selector de Rol Único */}
                    {!isLastAdmin() ? (
                    <div className="mb-6 relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium mb-2">
                            Role *
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsRolesOpen(!isRolesOpen)}
                            className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="truncate">
                                {formData.roles[0]
                                    ? roles
                                          .find(
                                              (r) => r.id === formData.roles[0]
                                          )
                                          ?.name.replace("-", " ")
                                    : "Select a role"}
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
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-y-auto">
                                <div
                                    onClick={() => handleRoleSelect(null)}
                                    className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                                        formData.roles.length === 0
                                            ? "bg-blue-50"
                                            : ""
                                    }`}
                                >
                                    No role
                                </div>

                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        onClick={() =>
                                            handleRoleSelect(role.id)
                                        }
                                        className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                                            formData.roles.includes(role.id)
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        {role.name.replace("-", " ")}
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.roles && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.roles}
                            </p>
                        )}
                    </div>
                           ) : (
                           <p className="text-sm text-red-600 mb-6">
                         You cannot change the role of the last Admin user.
                    </p>
                    )}
                    
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