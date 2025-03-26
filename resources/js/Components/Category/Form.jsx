import { useState } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link } from "@inertiajs/react";

const Form = ({ data, errors, setData, submit, isEdit = false, children }) => {
    const [successMessage, setSuccessMessage] = useState("");
    const [imagePreviews, setImagePreviews] = useState(
        isEdit && data.existing_images
            ? data.existing_images.map((img) => `/storage/${img.url}`)
            : []
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(e);
        setSuccessMessage(
            isEdit
                ? "Categoría actualizada con éxito"
                : "Categoría creada con éxito"
        );
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleImageChange = (files) => {
        const fileArray = Array.from(files);
        setData("new_images", [...(data.images || []), ...fileArray]); // Cambiar a "images"

        const previews = fileArray.map((file) => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };
    
    const removeImage = (index) => {
        // Si es una imagen existente, agregar a deleted_images
        if (index < imagePreviews.length - (data.new_images?.length || 0)) {
            const deletedId = data.existing_images[index].id;
            setData("deleted_images", [
                ...(data.deleted_images || []),
                deletedId,
            ]);
        }

        // Actualizar previews
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);

        // Actualizar new_images si corresponde
        if (index >= imagePreviews.length - (data.new_images?.length || 0)) {
            const newImages = [...(data.new_images || [])];
            newImages.splice(
                index - (imagePreviews.length - newImages.length),
                1
            );
            setData("new_images", newImages);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length) {
            handleImageChange(e.dataTransfer.files);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
            {successMessage && (
                <div className="p-4 mb-4 text-green-800 bg-green-100 border border-green-400 rounded-md">
                    {successMessage}
                </div>
            )}
            <div className="flex gap-6">
                <div className="w-2/3">
                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="Nombre"
                            className="text-gray-700 font-semibold"
                        />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name || ""}
                            className="mt-2 block w-1/2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError
                            message={errors.name}
                            className="mt-2 text-red-600 text-sm"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="description"
                            value="Descripción"
                            className="text-gray-700 font-semibold"
                        />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description || ""}
                            className="w-full h-64 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 resize-none whitespace-pre-wrap overflow-auto"
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows={10}
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2 text-red-600 text-sm"
                        />
                    </div>
                </div>
                <div className="w-1/3">
                    <InputLabel
                        htmlFor="images"
                        value="Imágenes"
                        className="text-gray-700 font-semibold"
                    />
                    <div
                        className="mt-2 border-2 border-dashed border-gray-300 p-4 w-full h-80 rounded-lg text-center cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            id="images"
                            type="file"
                            name="new_images"
                            multiple
                            className="hidden"
                            onChange={(e) => handleImageChange(e.target.files)}
                        />
                        <label
                            htmlFor="images"
                            className="block text-gray-600 cursor-pointer"
                        >
                            Haz clic para cargar imágenes o arrástralas aquí
                        </label>
                    </div>
                    <InputError message={errors.images} className="mt-2" />
                </div>
            </div>
            {imagePreviews.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-gray-700 font-semibold mb-2">
                        Vista previa:
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full h-80 border border-gray-300 rounded-lg flex items-center justify-center">
                            {imagePreviews.length > 0 && (
                                <img
                                    src={imagePreviews[0]}
                                    alt="Vista previa"
                                    className="h-full object-contain"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt="Vista previa"
                                        className="w-full h-24 object-cover rounded-md border cursor-pointer hover:opacity-75"
                                        onClick={() =>
                                            setImagePreviews([
                                                preview,
                                                ...imagePreviews.filter(
                                                    (_, i) => i !== index
                                                ),
                                            ])
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                        onClick={() => removeImage(index)}
                                    ></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <Link
                    href={route("category.index")}
                    className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition duration-300"
                >
                    Volver
                </Link>
                {children}
            </div>
        </form>
    );
};

export default Form;
