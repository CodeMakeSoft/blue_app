import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Toaster } from "sonner";

export default function CategoryFormModal({ isOpen, closeModal, category }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description,
            });
        } else {
            setFormData({ name: "", description: "" });
        }
    }, [category, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isEdit = !!category?.id;
        const url = isEdit
            ? route("category.update", category.id)
            : route("category.store");

        setIsSubmitting(true);

        router.post(url, formData, {
            method: isEdit ? "put" : "post",
            onSuccess: () => {
                closeModal(); // Cierra el modal tras éxito
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <Toaster richColors position="top-right" />
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
                    <h2 className="text-lg font-semibold mb-4">
                        {category ? "Editar Categoría" : "Agregar Categoría"}
                    </h2>
                    <form onSubmit={handleSubmit} className="text-left">
                        <div className="mb-3">
                            <label className="block text-sm font-medium">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                disabled={isSubmitting}
                            >
                                {category ? "Actualizar" : "Crear"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
