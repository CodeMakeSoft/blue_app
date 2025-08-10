import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link } from "@inertiajs/react";

const Form = ({
    data,
    errors,
    setData,
    submit,
    isEdit = false,
    existingNames = [],
    parentCategories = [],
    children,
    isSubmitting = false,
}) => {
    // Estados del componente
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [imagePreview, setImagePreview] = useState(
        isEdit && data.existing_image
            ? `/storage/${data.existing_image.url}`
            : null
    );
    const [formErrors, setFormErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);
    const [descriptionTouched, setDescriptionTouched] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    // Preparar categorías para mostrar jerarquía
    const formattedCategories = useMemo(() => {
        const formatCategory = (category, depth = 0) => ({
            ...category,
            name: `${"— ".repeat(depth)}${category.name}`,
            depth,
        });

        const flattenCategories = (categories, depth = 0) => {
            return categories.reduce((acc, category) => {
                acc.push(formatCategory(category, depth));
                if (category.children && category.children.length > 0) {
                    acc.push(
                        ...flattenCategories(category.children, depth + 1)
                    );
                }
                return acc;
            }, []);
        };

        return flattenCategories(parentCategories);
    }, [parentCategories]);

    // Manejo vista previa imagen
    useEffect(() => {
        if (data.image && typeof data.image === "object") {
            const objectUrl = URL.createObjectURL(data.image);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (isEdit && data.existing_image && !data.deleted_image) {
            setImagePreview(`/storage/${data.existing_image.url}`);
        } else {
            setImagePreview(null);
        }
    }, [data.image, data.existing_image, data.deleted_image, isEdit]);

    // Cerrar menú editar imagen si se clickea afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEditMenuOpen && !event.target.closest(".relative")) {
                setIsEditMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isEditMenuOpen]);

    // Validación por campo
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case "name":
                if (!value || value.trim() === "")
                    return "El nombre es requerido";
                if (
                    existingNames.includes(value.trim().toLowerCase()) &&
                    (!isEdit ||
                        value.trim().toLowerCase() !==
                            (data.originalName || "").toLowerCase())
                ) {
                    return "Ya existe una categoría con este nombre";
                }
                return null;

            case "description":
                if (!value || value.trim() === "")
                    return "La descripción es requerida";
                return null;

            default:
                return null;
        }
    };

    // Maneja cambios para todos inputs (nombre, descripción, etc)
    const handleChange = (e) => {
        const { name, value } = e.target;

        setData(name, value);

        // Validar en tiempo real
        const error = validateField(name, value);
        if (error) {
            setFormErrors((prev) => ({ ...prev, [name]: error }));
        } else {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Marcar campos como tocados para mostrar error
        if (name === "name") setNameTouched(true);
        if (name === "description") setDescriptionTouched(true);
    };

    const handleImageChange = (file) => {
        if (!file || !file.type.match("image.*")) {
            setFormErrors({
                ...formErrors,
                image: "El archivo debe ser una imagen válida",
            });
            return;
        }

        setData((prev) => ({
            ...prev,
            image: file,
            deleted_image: false,
            existing_image: null,
        }));

        setFileInputKey(Date.now());
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsEditMenuOpen(false);

        setFormErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
        });
    };

    const removeImage = () => {
        setData((prev) => ({
            ...prev,
            image: null,
            deleted_image: true,
            existing_image: null,
        }));
        setImagePreview(null);
        setIsEditMenuOpen(false);
    };

    const handleChangeImage = () => {
        removeImage();
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 10);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    };

    // Manejar el envío del formulario - Versión mejorada
     const handleSubmit = (e) => {
         e.preventDefault();
         setNameTouched(true);
         setDescriptionTouched(true);

         const errorsFound = {};
         ["name", "description"].forEach((field) => {
             const error = validateField(field, data[field]);
             if (error) errorsFound[field] = error;
         });

         setFormErrors(errorsFound);

         if (Object.keys(errorsFound).length === 0) {
             // Crear FormData para enviar archivos
             const formData = new FormData();
             formData.append("name", data.name);
             formData.append("description", data.description);

             if (data.parent_id !== null) {
                 formData.append("parent_id", data.parent_id);
             }

             // Para edición, usamos el método spoofing de Laravel
             if (isEdit) {
                 formData.append("_method", "PUT"); // Esto hará que Laravel lo trate como PUT
             }

             if (data.deleted_image) {
                 formData.append("deleted_image", "true");
             }

             if (data.image) {
                 formData.append("image", data.image);
             }

             // Llamar a la función submit con el FormData
             submit(formData, {
                 preserveScroll: true,
                 forceFormData: true, // Asegura que Inertia use FormData
                 onSuccess: () => {
                     // Resetear el estado de la imagen después de un envío exitoso
                     if (data.image) {
                         setData("image", null);
                         setFileInputKey(Date.now());
                     }
                 },
             });
         }
     };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sección de datos de la categoría */}
                <div className="w-full md:w-[65%] bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    {/* Selector de categoría padre */}
                    <div className="mb-6">
                        <InputLabel
                            htmlFor="parent_id"
                            value="Categoría Padre"
                            className="text-gray-700 dark:text-gray-200 font-semibold mb-2"
                        />
                        <select
                            id="parent_id"
                            name="parent_id"
                            value={data.parent_id || ""}
                            onChange={(e) =>
                                setData(
                                    "parent_id",
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : null
                                )
                            }
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                            disabled={isSubmitting}
                        >
                            <option value="">
                                Sin categoría padre (categoría raíz)
                            </option>
                            {formattedCategories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                    disabled={isEdit && category.id === data.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.parent_id}
                            className="mt-2"
                        />
                    </div>

                    {/* Campo de nombre */}
                    <div className="mb-6">
                        <InputLabel
                            htmlFor="name"
                            value="Nombre"
                            className="text-gray-700 dark:text-gray-200 font-semibold mb-2"
                        />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name || ""}
                            className={`w-full p-3 border ${
                                (nameTouched && formErrors.name) || errors.name
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-600"
                            } rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                            onChange={handleChange}
                            onBlur={() => setNameTouched(true)}
                            disabled={isSubmitting}
                            placeholder="Ej: Electrónica, Ropa, Hogar"
                        />
                        <InputError
                            message={formErrors.name || errors.name}
                            className="mt-2"
                        />
                    </div>

                    {/* Campo de descripción */}
                    <div>
                        <InputLabel
                            htmlFor="description"
                            value="Descripción"
                            className="text-gray-700 dark:text-gray-200 font-semibold mb-2"
                        />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description || ""}
                            className={`w-full mt-1 p-2 border ${
                                (descriptionTouched &&
                                    formErrors.description) ||
                                errors.description
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-600"
                            } rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-40 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                            onChange={handleChange}
                            onBlur={() => setDescriptionTouched(true)}
                            disabled={isSubmitting}
                        />
                        <InputError
                            message={
                                formErrors.description || errors.description
                            }
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Sección de imagen */}
                <div className="w-full md:w-[35%] bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Imagen
                        </h2>

                        {imagePreview && (
                            <div className="relative">
                                <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    onClick={() =>
                                        setIsEditMenuOpen(!isEditMenuOpen)
                                    }
                                    disabled={isSubmitting}
                                >
                                    Editar
                                </button>

                                {isEditMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 border dark:border-gray-600">
                                        <button
                                            type="button"
                                            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={handleChangeImage}
                                            disabled={isSubmitting}
                                        >
                                            Cambiar imagen
                                        </button>
                                        <button
                                            type="button"
                                            className="block w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={() => {
                                                removeImage();
                                                setIsEditMenuOpen(false);
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            Eliminar imagen
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        className={`border-2 rounded-lg flex flex-col items-center justify-center p-4 h-64 ${
                            isDragging
                                ? "border-blue-400 bg-blue-50 dark:bg-blue-900"
                                : imagePreview
                                ? "border-transparent"
                                : "border-dashed border-gray-300 dark:border-gray-600"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={imagePreview}
                                    alt="Vista previa"
                                    className="w-full h-full object-contain"
                                    style={{
                                        maxHeight: "400px",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-center">
                                <label
                                    htmlFor="image-upload"
                                    className={`px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer inline-block mb-3 ${
                                        isSubmitting
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    Añadir imagen
                                </label>
                                <input
                                    key={fileInputKey}
                                    id="image-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageChange(file);
                                    }}
                                    disabled={isSubmitting}
                                />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {isDragging
                                        ? "Suelta la imagen aquí"
                                        : "Arrastra una imagen aquí"}
                                </p>
                                <InputError
                                    message={formErrors.image}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Acciones del formulario */}
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                {React.cloneElement(children, {
                    disabled:
                        isSubmitting || Object.keys(formErrors).length > 0,
                    className: `${children.props.className || ""} ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`,
                })}
            </div>
        </form>
    );
};

export default Form;
