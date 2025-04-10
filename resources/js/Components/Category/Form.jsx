import { useState, useEffect, useRef } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link } from "@inertiajs/react";
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
    const [successMessage, setSuccessMessage] = useState("");
    const [imagePreview, setImagePreview] = useState(
        isEdit && data.existing_image
            ? `/storage/${data.existing_image.url}`
            : null
    );
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [nameTouched, setNameTouched] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    // Cargar vista previa al editar
    useEffect(() => {
        if (isEdit && data.existing_image) {
            const preview = `/storage/${data.existing_image.url}`;
            setImagePreview(preview);
        }
    }, [isEdit, data.existing_image]);

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

    // Validación en tiempo real para el nombre
    const validateName = (name) => {
        if (!name) {
            return "El nombre es requerido";
        }
        if (existingNames.includes(name.trim().toLowerCase())) {
            return "Ya existe una categoría con este nombre";
        }
        return null;
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setData("name", value);
        setNameTouched(true);

        const error = validateName(value);
        if (error) {
            setFormErrors({ ...formErrors, name: error });
        } else {
            const newErrors = { ...formErrors };
            delete newErrors.name;
            setFormErrors(newErrors);
        }
    };

    const handleImageChange = (file) => {
        if (!file.type.match("image.*")) {
            setFormErrors({
                ...formErrors,
                image: "El archivo debe ser una imagen",
            });
            return;
        }

        setData("image", file);
        setData("deleted_image", false);
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);

        const newErrors = { ...formErrors };
        delete newErrors.image;
        setFormErrors(newErrors);
    };

    const removeImage = () => {
        if (isEdit && data.existing_image) {
            setData("deleted_image", true);
        }
        setData("image", null);
        setImagePreview(null);
    };

    const handleChangeImage = () => {
        // 1. Eliminar la imagen actual
        removeImage();

        // 2. Abrir el selector de archivos después de un pequeño retraso
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 10);

        // 3. Cerrar el menú
        setIsEditMenuOpen(false);
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

    return (
        <form onSubmit={submit} className="space-y-6">
            {successMessage && (
                <div className="p-4 mb-6 text-green-800 bg-green-100 border border-green-400 rounded-md">
                    {successMessage}
                </div>
            )}

            {/* Contenedores alineados horizontalmente */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Contenedor de datos (65%) */}
                <div className="w-full md:w-[65%] bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Campo Nombre */}
                    <div className="mb-6">
                        <InputLabel
                            htmlFor="name"
                            value="Nombre"
                            className="text-gray-700 font-semibold mb-2"
                        />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name || ""}
                            className={`w-full p-3 border ${
                                nameTouched && formErrors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
                            onChange={handleNameChange}
                            onBlur={() => setNameTouched(true)}
                            disabled={isSubmitting}
                            placeholder="e.g. Deportes, Electrodomésticos"
                        />
                        {nameTouched && formErrors.name ? (
                            <InputError
                                message={formErrors.name}
                                className="mt-2 text-red-600 text-sm"
                            />
                        ) : (
                            errors.name && (
                                <InputError
                                    message={errors.name}
                                    className="mt-2 text-red-600 text-sm"
                                />
                            )
                        )}
                    </div>

                    {/* Campo Descripción */}
                    <div>
                        <InputLabel
                            htmlFor="description"
                            value="Descripción"
                            className="text-gray-700 font-semibold mb-2"
                        />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description || ""}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 h-40"
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        {errors.description && (
                            <InputError
                                message={errors.description}
                                className="mt-2 text-red-600 text-sm"
                            />
                        )}
                    </div>
                </div>

                {/* Contenedor de imagen (35%) */}
                <div className="w-full md:w-[35%] bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    {/* Encabezado con título y botón Editar */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Imagen
                        </h2>

                        {/* Menú desplegable Editar */}
                        {imagePreview && (
                            <div className="relative">
                                <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                    onClick={() =>
                                        setIsEditMenuOpen(!isEditMenuOpen)
                                    }
                                >
                                    Editar
                                </button>

                                {/* Menú desplegable */}
                                {isEditMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <button
                                            type="button"
                                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                            onClick={handleChangeImage}
                                            disabled={isSubmitting}
                                        >
                                            Cambiar imagen
                                        </button>
                                        <button
                                            type="button"
                                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
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

                    {/* Contenedor de imagen */}
                    <div
                        className={`border-2 rounded-lg flex flex-col items-center justify-center p-4 h-64 ${
                            isDragging
                                ? "border-blue-400 bg-blue-50"
                                : imagePreview
                                ? "border-transparent"
                                : "border-dashed border-gray-300"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={imagePreview}
                                    alt="Vista previa de la categoría"
                                    className="w-full h-full object-contain"
                                    style={{
                                        maxHeight: "400px",
                                        maxWidth: "100%",
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
                                    id="image-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        e.target.files[0] &&
                                        handleImageChange(e.target.files[0])
                                    }
                                    disabled={isSubmitting}
                                />
                                <p className="text-gray-500 text-sm">
                                    {isDragging
                                        ? "Suelta la imagen aquí"
                                        : "Arrastrar una imagen aquí"}
                                </p>
                                {formErrors.image && (
                                    <InputError
                                        message={formErrors.image}
                                        className="mt-2 text-red-600 text-sm"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Barra inferior con botones */}
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
