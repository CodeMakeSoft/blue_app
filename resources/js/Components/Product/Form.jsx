import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useRef, useState, useEffect } from "react";

export default function Form({
    data,
    setData,
    errors,
    categories,
    brands,
    submit,
    product = {},
}) {
    const [previewImages, setPreviewImages] = useState([]);
    const fileInputRef = useRef(null);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [descriptionStatus, setDescriptionStatus] = useState("");
    const [descriptionLength, setDescriptionLength] = useState(0);

    useEffect(() => {
        // Calcular longitud y estado de la descripción
        const length = data.description?.length || 0;
        setDescriptionLength(length);

        if (length === 0) {
            setDescriptionStatus("");
        } else if (length < 50) {
            setDescriptionStatus("Corta");
        } else if (length < 150) {
            setDescriptionStatus("Regular");
        } else {
            setDescriptionStatus("Buena");
        }
    }, [data.description]);

    // Nueva función para manejar el cambio de precio y evitar NaN
    const handlePriceChange = (e) => {
        const value = e.target.value;
        const price = value ? parseFloat(value) : 0; // Si no hay valor, asigna 0
        setData("price", price);
    };

    // Función modificada para calcular el precio con IVA e IEPS
    const calculatePriceWithTaxes = (price) => {
        const validPrice = price && !isNaN(price) && price > 0 ? price : 0; // Valida el precio

        if (validPrice === 0) {
            return "0.00"; // Si el precio no es válido, retorna 0.00
        }

        const iva = 0.16; // 16% IVA
        const ieps = 0.05; // 5% IEPS
        const priceWithIva = validPrice * (1 + iva);
        const priceWithIeps = priceWithIva * (1 + ieps);
        return priceWithIeps.toFixed(2); // Formatear a dos decimales
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPreviewImages([...previewImages, ...newPreviews]);
        setData("images", [...(data.images || []), ...files]);
    };

    const removeImage = (index, imageId = null) => {
        if (imageId) setImagesToDelete([...imagesToDelete, imageId]);

        const updatedPreviews = [...previewImages];
        updatedPreviews.splice(index, 1);
        setPreviewImages(updatedPreviews);

        const updatedImages = [...data.images];
        updatedImages.splice(index, 1);
        setData("images", updatedImages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submit({
            ...data,
            deleted_images: imagesToDelete,
        });
    };

    return (
        <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900 dark:text-white"
            encType="multipart/form-data"
        >
            <div className="space-y-4">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nombre*"
                        className="dark:text-white"
                    />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    <InputError
                        message={errors.name}
                        className="dark:text-red-400"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="description"
                        value="Descripción*"
                        className="dark:text-white"
                    />
                    <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        className="w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[120px]"
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError
                        message={errors.description}
                        className="dark:text-red-400"
                    />

                    <div className="mt-2 text-sm">
                        <div
                            className={`h-1 rounded-md ${
                                descriptionStatus === "Buena"
                                    ? "bg-green-500"
                                    : descriptionStatus === "Regular"
                                    ? "bg-yellow-500"
                                    : descriptionStatus === "Corta"
                                    ? "bg-red-500"
                                    : "bg-gray-200 dark:bg-gray-600"
                            }`}
                            style={{
                                width: `${Math.min(
                                    (descriptionLength / 200) * 100,
                                    100
                                )}%`,
                                maxWidth: "100%",
                            }}
                        ></div>
                        <p
                            className={`mt-1 ${
                                descriptionStatus === "Buena"
                                    ? "text-green-600 dark:text-green-400"
                                    : descriptionStatus === "Regular"
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : descriptionStatus === "Corta"
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {descriptionStatus === "Buena"
                                ? "Descripción adecuada"
                                : descriptionStatus === "Regular"
                                ? "Descripción aceptable (recomendado añadir más detalles)"
                                : descriptionStatus === "Corta"
                                ? "Descripción muy corta (mínimo 50 caracteres)"
                                : "Escribe una descripción detallada (recomendado 150-200 caracteres)"}
                        </p>
                    </div>
                </div>

                <div>
                    <InputLabel
                        htmlFor="price"
                        value="Precio*"
                        className="dark:text-white"
                    />
                    <div className="relative">
                        <div className="flex items-center">
                            <span className="absolute left-3 text-gray-500 dark:text-gray-300">
                                $
                            </span>
                            <TextInput
                                id="price"
                                type="number"
                                name="price"
                                value={data.price}
                                className="w-full pl-7 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                onChange={handlePriceChange}
                            />
                        </div>
                        <InputError
                            message={errors.price}
                            className="dark:text-red-400"
                        />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                        Precio con IVA e IEPS: $
                        {calculatePriceWithTaxes(data.price)}
                    </div>
                </div>

                <div>
                    <InputLabel
                        htmlFor="stock"
                        value="Stock*"
                        className="dark:text-white"
                    />
                    <TextInput
                        id="stock"
                        type="number"
                        name="stock"
                        value={data.stock}
                        className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) =>
                            setData("stock", parseInt(e.target.value))
                        }
                    />
                    <InputError
                        message={errors.stock}
                        className="dark:text-red-400"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel
                        htmlFor="category_id"
                        value="Categoría*"
                        className="dark:text-white"
                    />
                    <select
                        id="category_id"
                        name="category_id"
                        value={data.category_id}
                        className="w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) => setData("category_id", e.target.value)}
                    >
                        <option value="">Seleccionar Opción</option>
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                                className="dark:bg-gray-700"
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <InputError
                        message={errors.category_id}
                        className="dark:text-red-400"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="brand_id"
                        value="Marca"
                        className="dark:text-white"
                    />
                    <select
                        id="brand_id"
                        name="brand_id"
                        value={data.brand_id}
                        className="w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) => setData("brand_id", e.target.value)}
                    >
                        <option value="">Seleccionar Opción</option>
                        {brands.map((brand) => (
                            <option
                                key={brand.id}
                                value={brand.id}
                                className="dark:bg-gray-700"
                            >
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    <InputError
                        message={errors.brand_id}
                        className="dark:text-red-400"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="size"
                        value="Talla*"
                        className="dark:text-white"
                    />
                    <select
                        id="size"
                        name="size"
                        value={data.size}
                        className="w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) => setData("size", e.target.value)}
                    >
                        <option value="">Seleccionar Talla</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    <InputError
                        message={errors.size}
                        className="dark:text-red-400"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="color"
                        value="Color"
                        className="dark:text-white"
                    />
                    <select
                        id="color"
                        name="color"
                        value={data.color}
                        className="w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) => setData("color", e.target.value)}
                    >
                        <option value="">Seleccionar Color</option>
                        <option className="dark:bg-gray-700">Rojo</option>
                        <option className="dark:bg-gray-700">
                            Azul marino
                        </option>
                        <option className="dark:bg-gray-700">Amarillo</option>
                        <option className="dark:bg-gray-700">Blanco</option>
                        <option className="dark:bg-gray-700">Negro</option>
                        <option className="dark:bg-gray-700">Gris claro</option>
                        <option className="dark:bg-gray-700">
                            Gris oscuro
                        </option>
                        <option className="dark:bg-gray-700">Verde</option>
                        <option className="dark:bg-gray-700">Naranja</option>
                        <option className="dark:bg-gray-700">Púrpura</option>
                        <option className="dark:bg-gray-700">Beige</option>
                        <option className="dark:bg-gray-700">Marrón</option>
                        <option className="dark:bg-gray-700">Rosa</option>
                        <option className="dark:bg-gray-700">Turquesa</option>
                    </select>
                    <InputError
                        message={errors.size}
                        className="dark:text-red-400"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="status"
                        value="Estado"
                        className="dark:text-white"
                    />
                    <div className="flex items-center">
                        <input
                            id="status"
                            type="checkbox"
                            checked={data.status}
                            className="h-5 w-5 text-gray-700 dark:text-blue-400"
                            onChange={(e) =>
                                setData("status", e.target.checked)
                            }
                        />
                        <span className="ml-2 text-gray-700 dark:text-white">
                            Activo
                        </span>
                    </div>
                    <InputError
                        message={errors.status}
                        className="dark:text-red-400"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="images"
                        value="Imágenes del producto"
                        className="dark:text-white"
                    />
                    <input
                        type="file"
                        id="images"
                        name="images"
                        ref={fileInputRef}
                        className="w-full mt-1 text-gray-700 dark:text-gray-300"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                    <InputError
                        message={errors.images}
                        className="dark:text-red-400"
                    />

                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {product.images?.map((image, index) => (
                                <div
                                    key={`existing-${image.id}`}
                                    className="relative group"
                                >
                                    <img
                                        src={
                                            image.url.startsWith("http")
                                                ? image.url
                                                : `/storage/${image.url}`
                                        }
                                        alt={`Imagen de ${product.name}`}
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeImage(index, image.id)
                                        }
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {previewImages.map((preview, index) => (
                                <div
                                    key={`preview-${index}`}
                                    className="relative group"
                                >
                                    <img
                                        src={preview.preview}
                                        alt={`Previsualización ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {product.images?.length === 0 &&
                            previewImages.length === 0 && (
                                <p className="text-gray-500 dark:text-gray-300 mt-2">
                                    No hay imágenes seleccionadas
                                </p>
                            )}
                    </div>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end mt-4 gap-4">
                <PrimaryButton
                    type="submit"
                    className="
                        bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500
                        text-white font-medium py-2 px-4 rounded-full shadow-sm
                        hover:shadow-lg transition duration-300
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        dark:focus:ring-offset-gray-800
                        active:scale-95 active:shadow-inner active:bg-blue-800 dark:active:bg-blue-700
                    "
                >
                    Guardar cambios
                </PrimaryButton>
            </div>
        </form>
    );
}
