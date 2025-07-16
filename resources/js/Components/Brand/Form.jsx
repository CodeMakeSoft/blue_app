import { useState, useEffect, useRef } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import React from "react";

const Form = ({ data, errors, setData, submit, isEdit = false, children }) => {
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [imagePreview, setImagePreview] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (data.image && typeof data.image === "object") {
            const objectUrl = URL.createObjectURL(data.image);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (isEdit && data.existing_image && !data.deleted_image) {
            setImagePreview(
                `/storage/${data.existing_image.url}?t=${Date.now()}`
            );
        } else {
            setImagePreview(null);
        }
    }, [data.image, data.existing_image, data.deleted_image, isEdit]);

    const handleNameChange = (e) => {
        setData("name", e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setData("description", e.target.value);
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
        const newErrors = { ...formErrors };
        delete newErrors.image;
        setFormErrors(newErrors);
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Datos */}
                <div className="w-full md:w-[65%] bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="mb-6">
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name || ""}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            onChange={handleNameChange}
                            placeholder="Marca ejemplo"
                        />
                        {errors.name && <InputError message={errors.name} />}
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Descripción" />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description || ""}
                            className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm h-40"
                            onChange={handleDescriptionChange}
                        />
                        {errors.description && (
                            <InputError message={errors.description} />
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
                                        >
                                            Cambiar imagen
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="block w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                                    className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block mb-3"
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

            <div className="flex justify-end border-t pt-4 mt-6">
                {React.cloneElement(children, {
                    disabled: Object.keys(formErrors).length > 0,
                    className: `${children.props.className || ""}`,
                })}
            </div>
        </form>
    );
};

export default Form;
