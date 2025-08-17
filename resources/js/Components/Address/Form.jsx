import { useState, useEffect, useRef } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";
import MapDisplay from "./MapDisplay";
import countries from "world-countries";

export default function Form({ data, setData, errors, isEditing, onSubmit }) {
    const [postalError, setPostalError] = useState("");
    const [loading, setLoading] = useState(false);
    const [addressValidated, setAddressValidated] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [showPostalData, setShowPostalData] = useState(false);
    const [neighbourhoods, setNeighbourhoods] = useState([]);
    const [neighbourhoodWarning, setNeighbourhoodWarning] = useState(false);
    const timeoutRefs = useRef([]);

    // Limpieza de timeouts al desmontar
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach((id) => clearTimeout(id));
        };
    }, []);

    useEffect(() => {
        const formattedCountries = countries
            .map((country) => ({
                code: country.cca2,
                name: country.name.common,
                postalRegex: getPostalRegex(country.cca2),
                latlng: country.latlng,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        setCountryList(formattedCountries);
    }, []);

    const getPostalRegex = (countryCode) => {
        const validations = {
            MX: /^\d{5}$/,
            US: /^\d{5}(-\d{4})?$/,
            CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
            ES: /^\d{5}$/,
            AR: /^\d{4}$/,
            BR: /^\d{5}-?\d{3}$/,
            CO: /^\d{6}$/,
            PE: /^\d{5}$/,
            CL: /^\d{7}$/,
        };
        return validations[countryCode] || /^\d{4,8}$/;
    };

    const getPostalExample = (countryCode) => {
        const examples = {
            MX: "06100",
            US: "10001",
            CA: "K1A 0A6",
            ES: "28001",
            AR: "1000",
            BR: "01310-100",
            CO: "110111",
            PE: "15001",
            CL: "7500000",
        };
        return examples[countryCode] || "12345";
    };

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        const selectedCountry = countryList.find((c) => c.code === countryCode);

        setData((prev) => ({
            ...prev,
            country_code: selectedCountry?.code || "",
            country: selectedCountry?.name || "",
            lat: selectedCountry?.latlng?.[0] || null,
            lng: selectedCountry?.latlng?.[1] || null,
            zoom: 4,
            postal_code: "",
            state: "",
            municipality: "",
            street: "",
            city: "",
            neighbourhood: "",
            is_default: false,
        }));
        setAddressValidated(false);
        setPostalError("");
        setNeighbourhoods([]);
    };

    const validatePostalCode = async () => {
        if (!data.country_code || !data.postal_code) {
            setPostalError("Seleccione un país e ingrese un código postal");
            return;
        }

        const regex = getPostalRegex(data.country_code);
        if (!regex.test(data.postal_code)) {
            setPostalError(
                `Formato inválido. Ejemplo: ${getPostalExample(
                    data.country_code
                )}`
            );
            return;
        }

        setLoading(true);
        setPostalError("");

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?postalcode=${data.postal_code}&countrycodes=${data.country_code}&format=json&addressdetails=1&limit=5`
            );

            if (!response.ok) throw new Error("Error al consultar el servicio");

            const results = await response.json();

            if (!results || results.length === 0) {
                throw new Error(
                    "No se encontraron direcciones para este código postal"
                );
            }

            const bestResult = results[0];
            const address = bestResult.address || {};

            let zoomLevel = 12; // Default para municipio
            if (address.neighbourhood || address.suburb) {
                zoomLevel = 14; // Más cercano si hay colonia
            }

            const neighbourhoodOptions = results
                .flatMap((result) => [
                    result.address?.neighbourhood,
                    result.address?.suburb,
                ])
                .filter(Boolean)
                .filter((value, index, self) => self.indexOf(value) === index);

            setNeighbourhoods(neighbourhoodOptions);

            setData((prev) => ({
                ...prev,
                state: address.state || address.region || "",
                municipality: address.municipality || address.county || "",
                city: address.city || address.town || address.village || "",
                neighbourhood: neighbourhoodOptions[0] || "",
                lat: parseFloat(bestResult.lat),
                lng: parseFloat(bestResult.lon),
                zoom: zoomLevel,
            }));

            setAddressValidated(true);
            setShowPostalData(true);

            if (neighbourhoodOptions.length === 0) {
                setNeighbourhoodWarning(
                    "No se encontraron colonias registradas. Puede ingresarla manualmente."
                );
            } else {
                setNeighbourhoodWarning("");
            }
        } catch (error) {
            setPostalError(error.message);
            setAddressValidated(false);
            setShowPostalData(false);
        } finally {
            setLoading(false);
        }
    };

    const handlePostalCodeChange = (e) => {
        const value = e.target.value;
        setData((prev) => ({
            ...prev,
            postal_code: value,
            street: "",
            ext_number: "",
            neighbourhood: "",
            city: "",
            municipality: "",
            state: "",
        }));
        setAddressValidated(false);
        setPostalError("");
        setNeighbourhoods([]);
        setNeighbourhoodWarning("");
    };

    const handleNeighbourhoodChange = (e) => {
        setData((prev) => ({
            ...prev,
            neighbourhood: e.target.value,
        }));
    };

    const handleDefaultChange = (e) => {
        setData("is_default", e.target.checked);
    };

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 sm:space-y-6 dark:bg-gray-800 dark:text-white p-4 sm:p-6"
        >
            <div className="space-y-4 sm:space-y-6">
                {/* Layout responsivo mejorado */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    {/* Sección del formulario */}
                    <div className="order-2 xl:order-1 space-y-4 sm:space-y-6">
                        {/* País y Alias - Grid responsivo */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="country" value="País *" />
                                <select
                                    id="country"
                                    value={data.country_code || ""}
                                    onChange={handleCountryChange}
                                    className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Seleccione un país</option>
                                    {countryList.map((country) => (
                                        <option
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {country.name} ({country.code})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.country} />
                            </div>

                            <div className="sm:col-span-2">
                                <InputLabel
                                    htmlFor="alias"
                                    value="Nombre (Alias) *"
                                />
                                <TextInput
                                    id="alias"
                                    value={data.alias}
                                    onChange={(e) =>
                                        setData("alias", e.target.value)
                                    }
                                    className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                <InputError message={errors.alias} />
                            </div>
                        </div>

                        {/* Código Postal */}
                        <div>
                            <InputLabel
                                htmlFor="postal_code"
                                value="Código Postal *"
                            />
                            <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                <TextInput
                                    id="postal_code"
                                    value={data.postal_code}
                                    onChange={handlePostalCodeChange}
                                    className="flex-1 text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                                    placeholder={`Ej: ${getPostalExample(
                                        data.country_code
                                    )}`}
                                    disabled={!data.country_code}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={validatePostalCode}
                                    disabled={
                                        !data.country_code ||
                                        !data.postal_code ||
                                        loading
                                    }
                                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md whitespace-nowrap ${
                                        !data.country_code ||
                                        !data.postal_code ||
                                        loading
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {loading ? "Validando..." : "Validar"}
                                </button>
                            </div>
                            {postalError && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {postalError}
                                </p>
                            )}
                            {addressValidated && !postalError && (
                                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                                    ✓ Dirección validada correctamente
                                </p>
                            )}
                        </div>

                        {/* Datos del código postal - Solo mostrar si está validado */}
                        {showPostalData && (
                            <div className="space-y-4 border p-3 sm:p-4 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                {/* Grid responsivo para estado y municipio */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="state"
                                            value="Estado"
                                        />
                                        <TextInput
                                            id="state"
                                            value={
                                                data.state || "No especificado"
                                            }
                                            className="mt-1 block w-full text-sm sm:text-base bg-gray-100 dark:bg-gray-600 dark:text-white"
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="municipality"
                                            value="Municipio"
                                        />
                                        <TextInput
                                            id="municipality"
                                            value={
                                                data.municipality ||
                                                "No especificado"
                                            }
                                            className="mt-1 block w-full text-sm sm:text-base bg-gray-100 dark:bg-gray-600 dark:text-white"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Ciudad - Solo si existe */}
                                {data.city && (
                                    <div>
                                        <InputLabel
                                            htmlFor="city"
                                            value="Ciudad"
                                        />
                                        <TextInput
                                            id="city"
                                            value={data.city}
                                            className="mt-1 block w-full text-sm sm:text-base bg-gray-100 dark:bg-gray-600 dark:text-white"
                                            readOnly
                                        />
                                    </div>
                                )}

                                {/* Colonia */}
                                <div>
                                    <InputLabel
                                        htmlFor="neighbourhood"
                                        value="Colonia/Barrio *"
                                    />
                                    {neighbourhoods.length > 0 ? (
                                        <select
                                            id="neighbourhood"
                                            value={data.neighbourhood}
                                            onChange={handleNeighbourhoodChange}
                                            className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            {neighbourhoods.map(
                                                (neighbourhood, index) => (
                                                    <option
                                                        key={index}
                                                        value={neighbourhood}
                                                    >
                                                        {neighbourhood}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    ) : (
                                        <TextInput
                                            id="neighbourhood"
                                            value={data.neighbourhood}
                                            onChange={handleNeighbourhoodChange}
                                            className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                                            placeholder="Ingrese el nombre de la colonia"
                                            required
                                        />
                                    )}
                                    {neighbourhoodWarning && (
                                        <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                                            {neighbourhoodWarning}
                                        </p>
                                    )}
                                    <InputError
                                        message={errors.neighbourhood}
                                    />
                                </div>

                                {/* Calle */}
                                <div>
                                    <InputLabel
                                        htmlFor="street"
                                        value="Calle *"
                                    />
                                    <TextInput
                                        id="street"
                                        value={data.street}
                                        onChange={(e) =>
                                            setData("street", e.target.value)
                                        }
                                        className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <InputError message={errors.street} />
                                </div>

                                {/* Números - Grid responsivo */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="ext_number"
                                            value="Núm. Ext. *"
                                        />
                                        <TextInput
                                            id="ext_number"
                                            value={data.ext_number}
                                            onChange={(e) =>
                                                setData(
                                                    "ext_number",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <InputError
                                            message={errors.ext_number}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="int_number"
                                            value="Núm. Int."
                                        />
                                        <TextInput
                                            id="int_number"
                                            value={data.int_number}
                                            onChange={(e) =>
                                                setData(
                                                    "int_number",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Teléfono */}
                        <div>
                            <InputLabel htmlFor="phone" value="Teléfono *" />
                            <TextInput
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="mt-1 block w-full text-sm sm:text-base dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <InputError message={errors.phone} />
                        </div>

                        {/* Referencias */}
                        <div>
                            <InputLabel
                                htmlFor="references"
                                value="Referencias/Instrucciones"
                            />
                            <textarea
                                id="references"
                                name="references"
                                value={data.references || ""}
                                onChange={(e) =>
                                    setData("references", e.target.value)
                                }
                                className="mt-1 block w-full text-sm sm:text-base border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none"
                                rows={3}
                                placeholder="Instrucciones adicionales para el delivery..."
                            />
                        </div>

                        {/* Checkbox para dirección predeterminada */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="is_default"
                                checked={data.is_default || false}
                                onChange={handleDefaultChange}
                                className="flex-shrink-0"
                            />
                            <InputLabel
                                htmlFor="is_default"
                                value="Establecer como dirección predeterminada"
                                className="text-sm sm:text-base cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Sección del mapa */}
                    <div className="order-1 xl:order-2">
                        <div className="sticky top-4">
                            <div className="h-64 sm:h-80 lg:h-96 xl:h-[500px]">
                                {data.lat && data.lng ? (
                                    <div className="space-y-2 h-full">
                                        <MapDisplay
                                            lat={data.lat}
                                            lng={data.lng}
                                            zoom={data.zoom || 4}
                                            className="h-full w-full rounded-lg border border-gray-300 dark:border-gray-600"
                                        />
                                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                                                {data.neighbourhood &&
                                                    `${data.neighbourhood}, `}
                                                {data.municipality &&
                                                    `${data.municipality}, `}
                                                {data.state}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                                        <div className="text-center max-w-xs">
                                            <div className="mb-2">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {data.country_code
                                                    ? "Ingrese un código postal y haga clic en Validar"
                                                    : "Seleccione un país para habilitar la validación"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de envío - Responsivo */}
                <div className="flex flex-col sm:flex-row justify-end pt-4 space-y-3 sm:space-y-0">
                    <button
                        type="submit"
                        disabled={!addressValidated}
                        className={`w-full sm:w-auto px-6 py-3 text-sm sm:text-base rounded-md transition-colors font-medium ${
                            addressValidated
                                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600"
                        }`}
                    >
                        {isEditing
                            ? "Actualizar Dirección"
                            : "Guardar Dirección"}
                    </button>
                </div>
            </div>
        </form>
    );
}
