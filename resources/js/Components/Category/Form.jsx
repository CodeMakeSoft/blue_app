import { useState, useEffect, useRef } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import React from "react";

const Form = ({
    data,
    errors,
    setData,
    submit,
    isEdit = false,
    existingNames = [],
    children,
}) => {
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [imagePreview, setImagePreview] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);
    const [descriptionTouched, setDescriptionTouched] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    // Manejo vista previa imagen
    useEffect(() => {
        if (data.image && typeof data.image === "object") {
            const objectUrl = URL.createObjectURL(data.image);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (isEdit && data.existing_image && !data.remove_picture) {
            setImagePreview(`/storage/${data.existing_image.url}`);
        } else {
            setImagePreview(null);
        }
    }, [data.image, data.existing_image, data.remove_picture, isEdit]);

    // Cerrar menú editar imagen si se clickea afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEditMenuOpen && !event.target.closest(".relative")) {
                setIsEditMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
                image: "El archivo debe ser una imagen",
            });
            return;
        }

        setData((prev) => ({
            ...prev,
            image: file,
            remove_picture: false,
            existing_image: null,
        }));

        setFileInputKey(Date.now()); // Forzar reinicio input
        if (fileInputRef.current) fileInputRef.current.value = ""; // Limpiar input
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
            remove_picture: true,
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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    };

    // Validar todo al enviar
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
            submit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Datos */}
                <div className="w-full md:w-[65%] bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    {/* Nombre */}
                    <div className="mb-6">
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name || ""}
                            className={`w-full p-3 border ${
                                nameTouched && formErrors.name
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-600"
                            } rounded-md shadow-sm`}
                            onChange={handleChange}
                            onBlur={() => setNameTouched(true)}
                            disabled={isSubmitting}
                            placeholder="e.g. Deportes, Electrodomésticos"
                        />
                        {nameTouched && formErrors.name ? (
                            <InputError message={formErrors.name} />
                        ) : (
                            errors.name && <InputError message={errors.name} />
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <InputLabel htmlFor="description" value="Descripción" />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description || ""}
                            className={`w-full mt-1 p-2 border rounded-md shadow-sm h-40 ${
                                descriptionTouched && formErrors.description
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-600"
                            }`}
                            onChange={handleChange}
                            onBlur={() => setDescriptionTouched(true)}
                            disabled={isSubmitting}
                        />
                        {descriptionTouched && formErrors.description ? (
                            <InputError message={formErrors.description} />
                        ) : (
                            errors.description && (
                                <InputError message={errors.description} />
                            )
                        )}
                    </div>
                </div>

                {/* Imagen */}
                <div className="w-full md:w-[35%] bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Imagen</h2>

                        {imagePreview && (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsEditMenuOpen(!isEditMenuOpen)
                                    }
                                    className="text-blue-600 font-medium"
                                >
                                    Editar
                                </button>
                                {isEditMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 border dark:border-gray-600">
                                        <button
                                            type="button"
                                            onClick={handleChangeImage}
                                            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            disabled={isSubmitting}
                                        >
                                            Cambiar imagen
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="block w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                            <img
                                src={imagePreview}
                                alt="Vista previa"
                                className="w-full h-full object-contain"
                                style={{ maxHeight: "400px", maxWidth: "100%" }}
                            />
                        ) : (
                            <div className="text-center">
                                <label
                                    htmlFor="image-upload"
                                    className={`px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block mb-3 ${
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
                                <p className="text-gray-500 text-sm">
                                    {isDragging
                                        ? "Suelta la imagen aquí"
                                        : "Arrastra una imagen aquí"}
                                </p>
                                {formErrors.image && (
                                    <InputError message={formErrors.image} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-6">
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
