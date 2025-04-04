import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";


export default function CategoryFormModal({ isOpen, closeModal, category }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        picture: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");

    // Actualiza el estado cuando la categoría cambia
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description,
                picture: category.picture || "",
            });
            setPreview(category.picture || "");
            setSelectedFile(null);
        } else {
            setFormData({ name: "", description: "", picture: "", });
            setPreview("");
            setSelectedFile(null);
        }
    }, [category]);

    // Maneja cambios en los campos del formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Maneja cambios en el archivo seleccionado
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);

        // Si hay un archivo seleccionado, agrégalo al FormData
        if (selectedFile) {
            data.append("picture", selectedFile);
        }
        const successMessage = category?.id ? "Category Updated Successfully" : "Post Created Succesfully";
        const errorMessage = category?.id ? "Failed to Update Category": "Failed to Create Category";
        if (category?.id) {
            // Si hay una categoría, es una edición
            data.append("_method", "PUT");
            router.post(`/admin/categories/${category.id}`, data, {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    toast.success(errorMessage);
                    console.error(
                        errors.message || "Failed to submit category."
                    );
                },
            });
        } else {
            // Si no hay una categoría, es una creación
            router.post("/admin/categories", data, {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    toast.success(errorMessage);
                    console.error(
                        errors.message || "Failed to create category."
                    );
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">
                    {category ? "Edit Category" : "Add Category"}
                </h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">
                            Picture (optional)
                        </label>
                        <input
                            type="file"
                            name="picture"
                            onChange={handleFileChange}
                            className="w-full"
                            accept="image/*"
                        />
                    </div>
                    {preview && (
                        <div className="mb-3">
                            <p className="text-sm mb-1">Image Preview</p>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            {category ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
