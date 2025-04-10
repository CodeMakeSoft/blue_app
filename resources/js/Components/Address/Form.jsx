import { useState } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

const Form = ({ data, setData }) => {
    const [showPostalData, setShowPostalData] = useState(false);

    return (
        <form className="space-y-4">
            {/* País */}
            <div>
                <InputLabel htmlFor="country_id" value="País" />
                <select
                    id="country_id"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.country_id || ""}
                    onChange={(e) => setData("country_id", e.target.value)}
                >
                    <option value="">Seleccione un país</option>
                </select>
            </div>

            {/* Alias */}
            <div>
                <InputLabel htmlFor="alias" value="Nombre Completo (Alias)" />
                <TextInput
                    id="alias"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.alias || ""}
                    onChange={(e) => setData("alias", e.target.value)}
                />
            </div>

            {/* Calle */}
            <div>
                <InputLabel htmlFor="street" value="Calle" />
                <TextInput
                    id="street"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.street || ""}
                    onChange={(e) => setData("street", e.target.value)}
                />
            </div>

            {/* Números */}
            <div className="flex items-end space-x-10"> {/* Cambiado grid por flex y añadido space-x-1 */}
                <div>
                    <InputLabel htmlFor="ext_number" value="Número exterior" />
                    <TextInput
                        id="ext_number"
                        type="text"
                        className="mt-1 w-22"
                        value={data.ext_number || ""}
                        onChange={(e) => setData("ext_number", e.target.value)}
                    />
                </div>
                <div>
                    <InputLabel htmlFor="int_number" value="Número interior" />
                    <TextInput
                        id="int_number"
                        type="text"
                        className="mt-1 w-22" 
                        value={data.int_number || ""}
                        onChange={(e) => setData("int_number", e.target.value)}
                    />
                </div>
            </div>

            {/* Código Postal */}
            <div>
                <InputLabel htmlFor="postal_code" value="Código Postal" />
                <TextInput
                    id="postal_code"
                    type="text"
                    className="mt-1 block w-30"
                    value={data.postal_code || ""}
                    onChange={(e) => setData("postal_code", e.target.value)}
                />
            </div>

            {/* Sección que aparecerá al validar el código postal */}
            {showPostalData && (
                <div className="space-y-4 border p-4 rounded-md">
                    {/* Estado */}
                    <div>
                        <InputLabel htmlFor="state" value="Estado" />
                        <TextInput
                            id="state"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.state || ""}
                            onChange={(e) => setData("state", e.target.value)}
                        />
                    </div>

                    {/* Municipio */}
                    <div>
                        <InputLabel htmlFor="municipality" value="Municipio" />
                        <TextInput
                            id="municipality"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.municipality || ""}
                            onChange={(e) =>
                                setData("municipality", e.target.value)
                            }
                        />
                    </div>

                    {/* Ciudad */}
                    <div>
                        <InputLabel htmlFor="city" value="Ciudad" />
                        <TextInput
                            id="city"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.city || ""}
                            onChange={(e) => setData("city", e.target.value)}
                        />
                    </div>

                    {/* Distrito */}
                    <div>
                        <InputLabel htmlFor="district" value="Colonia" />
                        <TextInput
                            id="district"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.district || ""}
                            onChange={(e) =>
                                setData("district", e.target.value)
                            }
                        />
                    </div>
                </div>
            )}

            {/* Teléfono */}
            <div>
                <InputLabel htmlFor="phone" value="Teléfono" />
                <TextInput
                    id="phone"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.phone || ""}
                    onChange={(e) => setData("phone", e.target.value)}
                />
            </div>

            {/* Instrucciones de entrega */}
            <div>
                <InputLabel
                    htmlFor="delivery_instructions"
                    value="Instrucciones de entrega"
                />
                <textarea
                    id="delivery_instructions"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    rows={3}
                    value={data.delivery_instructions || ""}
                    onChange={(e) =>
                        setData("delivery_instructions", e.target.value)
                    }
                />
            </div>
        </form>
    );
};

export default Form;
