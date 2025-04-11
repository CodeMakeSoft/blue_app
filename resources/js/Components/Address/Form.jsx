import { useState, useEffect, useRef } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function Form({
    data,
    setData,
    errors,
    countries,
    districts,
    isEditing,
    onSubmit,
}) {
    const dropdownRef = useRef(null);
    const [postalError, setPostalError] = useState("");
    const [showPostalData, setShowPostalData] = useState(false);

    const verifyPostalCode = () => {
        if (!/^\d{5}$/.test(data.postal_code)) {
            setPostalError("Código postal inválido (usa 5 dígitos)");
            setShowPostalData(false);
            return false;
        }

        const matchingDistricts = districts.filter(
            (d) => d.postal_code === data.postal_code
        );

        if (matchingDistricts.length === 0) {
            setPostalError("Código postal no válido");
            setShowPostalData(false);
            return false;
        }

        setData("districts", matchingDistricts);
        setData(
            "state",
            matchingDistricts[0]?.city?.municipality?.state?.name || ""
        );
        setData(
            "municipality",
            matchingDistricts[0]?.city?.municipality?.name || ""
        );
        setData("city", matchingDistricts[0]?.city?.name || "");
        setData("district", matchingDistricts[0]?.name || "");
        setData(
            "district_id",
            isEditing ? data.district_id : matchingDistricts[0]?.id || ""
        );

        setPostalError("");
        setShowPostalData(true);
        return true;
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* País */}
            <div>
                <InputLabel htmlFor="country_id" value="País" />
                <select
                    id="country_id"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={
                        countries.find((c) => c.name === data.country)?.id || ""
                    }
                    onChange={(e) => {
                        const selected = countries.find(
                            (c) => c.id == e.target.value
                        );
                        setData("country", selected ? selected.name : "");
                    }}
                    required
                >
                    <option value="">Seleccione un país</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.country_id} />
            </div>

            {/* Alias */}
            <div>
                <InputLabel htmlFor="alias" value="Nombre (Alias)" />
                <TextInput
                    id="alias"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.alias}
                    onChange={(e) => setData("alias", e.target.value)}
                    required
                />
                <InputError message={errors.alias} />
            </div>

            {/* Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="street" value="Calle" />
                    <TextInput
                        id="street"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.street}
                        onChange={(e) => setData("street", e.target.value)}
                        required
                    />
                    <InputError message={errors.street} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel
                            htmlFor="ext_number"
                            value="Núm. Exterior"
                        />
                        <TextInput
                            id="ext_number"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.ext_number}
                            onChange={(e) =>
                                setData("ext_number", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.ext_number} />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="int_number"
                            value="Núm. Interior"
                        />
                        <TextInput
                            id="int_number"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.int_number}
                            onChange={(e) =>
                                setData("int_number", e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Código Postal */}
            <div className="flex items-end gap-4">
                <div className="mt-1 block w-30">
                    <InputLabel htmlFor="postal_code" value="Código Postal" />
                    <TextInput
                        id="postal_code"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.postal_code}
                        onChange={(e) => setData("postal_code", e.target.value)}
                        required
                    />
                    {postalError && (
                        <p className="text-sm text-red-600 italic mt-1">
                            {postalError}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        verifyPostalCode();
                    }}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
                >
                    Verificar
                </button>
            </div>

            {/* Datos derivados del CP */}
            {showPostalData && (
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <div>
                        <InputLabel htmlFor="state" value="Estado" />
                        <TextInput
                            id="state"
                            type="text"
                            className="mt-1 block w-full bg-gray-100"
                            value={data.state}
                            readOnly
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="municipality" value="Municipio" />
                        <TextInput
                            id="municipality"
                            type="text"
                            className="mt-1 block w-full bg-gray-100"
                            value={data.municipality}
                            readOnly
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="city" value="Ciudad" />
                        <TextInput
                            id="city"
                            type="text"
                            className="mt-1 block w-full bg-gray-100"
                            value={data.city}
                            readOnly
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="district_id" value="Colonia" />
                        <select
                            id="district_id"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={data.district_id}
                            onChange={(e) =>
                                setData("district_id", e.target.value)
                            }
                            required
                        >
                            <option value="">Seleccione una colonia</option>
                            {data.districts?.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.district_id} />
                    </div>
                </div>
            )}

            {/* Teléfono e instrucciones */}
            <div>
                <InputLabel htmlFor="phone" value="Teléfono" />
                <TextInput
                    id="phone"
                    type="tel"
                    className="mt-1 block w-full"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                />
                <InputError message={errors.phone} />
            </div>

            <div>
                <InputLabel
                    htmlFor="delivery_instructions"
                    value="Instrucciones de entrega"
                />
                <textarea
                    id="delivery_instructions"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    rows={3}
                    value={data.delivery_instructions}
                    onChange={(e) =>
                        setData("delivery_instructions", e.target.value)
                    }
                    placeholder="Código de acceso, color de la casa, referencias, etc."
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
                >
                    {isEditing ? "Actualizar Dirección" : "Agregar Dirección"}
                </button>
            </div>
        </form>
    );
}
