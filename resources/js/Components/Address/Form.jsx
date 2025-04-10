import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";

export default function Form({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { countries, states, municipalities, cities, districts } =
        usePage().props;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            country_id: "",
            state_id: "",
            municipality_id: "",
            city_id: "",
            district_id: "",
            street: "",
            exterior_number: "",
            interior_number: "",
            postal_code: "",
            phone: "+52",
            delivery_instructions: "",
            security_code: "",
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("locations.store"));
    };

    // Filtros para relaciones
    const filteredStates = states.filter(
        (state) => state.country_id == data.country_id
    );
    const filteredMunicipalities = municipalities.filter(
        (muni) => muni.state_id == data.state_id
    );
    const filteredCities = cities.filter(
        (city) => city.municipality_id == data.municipality_id
    );
    const filteredDistricts = districts.filter(
        (district) => district.city_id == data.city_id
    );

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Información de Dirección
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Actualiza tu información de dirección de envío.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* País/Región */}
                <div>
                    <InputLabel htmlFor="country_id" value="País o región" />
                    <SelectInput
                        id="country_id"
                        className="mt-1 block w-full"
                        value={data.country_id}
                        onChange={(e) => setData("country_id", e.target.value)}
                        required
                    >
                        <option value="">Selecciona un país</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.country_id} />
                </div>

                {/* Estado */}
                <div>
                    <InputLabel htmlFor="state_id" value="Estado" />
                    <SelectInput
                        id="state_id"
                        className="mt-1 block w-full"
                        value={data.state_id}
                        onChange={(e) => setData("state_id", e.target.value)}
                        required
                        disabled={!data.country_id}
                    >
                        <option value="">Selecciona un estado</option>
                        {filteredStates.map((state) => (
                            <option key={state.id} value={state.id}>
                                {state.name}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.state_id} />
                </div>

                {/* Municipio */}
                <div>
                    <InputLabel htmlFor="municipality_id" value="Municipio" />
                    <SelectInput
                        id="municipality_id"
                        className="mt-1 block w-full"
                        value={data.municipality_id}
                        onChange={(e) =>
                            setData("municipality_id", e.target.value)
                        }
                        required
                        disabled={!data.state_id}
                    >
                        <option value="">Selecciona un municipio</option>
                        {filteredMunicipalities.map((municipality) => (
                            <option
                                key={municipality.id}
                                value={municipality.id}
                            >
                                {municipality.name}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError
                        className="mt-2"
                        message={errors.municipality_id}
                    />
                </div>

                {/* Ciudad */}
                <div>
                    <InputLabel htmlFor="city_id" value="Ciudad" />
                    <SelectInput
                        id="city_id"
                        className="mt-1 block w-full"
                        value={data.city_id}
                        onChange={(e) => setData("city_id", e.target.value)}
                        required
                        disabled={!data.municipality_id}
                    >
                        <option value="">Selecciona una ciudad</option>
                        {filteredCities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.city_id} />
                </div>

                {/* Colonia/Distrito */}
                <div>
                    <InputLabel
                        htmlFor="district_id"
                        value="Colonia/Distrito"
                    />
                    <SelectInput
                        id="district_id"
                        className="mt-1 block w-full"
                        value={data.district_id}
                        onChange={(e) => {
                            setData("district_id", e.target.value);
                            // Autocompletar código postal si está disponible
                            const selectedDistrict = districts.find(
                                (d) => d.id == e.target.value
                            );
                            if (selectedDistrict) {
                                setData(
                                    "postal_code",
                                    selectedDistrict.postal_code
                                );
                            }
                        }}
                        required
                        disabled={!data.city_id}
                    >
                        <option value="">Selecciona una colonia</option>
                        {filteredDistricts.map((district) => (
                            <option key={district.id} value={district.id}>
                                {district.name} - {district.postal_code}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.district_id} />
                </div>

                {/* Calle y número */}
                <div>
                    <InputLabel htmlFor="street" value="Calle y número" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <TextInput
                                id="street"
                                className="mt-1 block w-full"
                                value={data.street}
                                onChange={(e) =>
                                    setData("street", e.target.value)
                                }
                                placeholder="Calle"
                                required
                            />
                            <InputError
                                className="mt-2"
                                message={errors.street}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <TextInput
                                    id="exterior_number"
                                    className="mt-1 block w-full"
                                    value={data.exterior_number}
                                    onChange={(e) =>
                                        setData(
                                            "exterior_number",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Núm. ext."
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.exterior_number}
                                />
                            </div>
                            <div>
                                <TextInput
                                    id="interior_number"
                                    className="mt-1 block w-full"
                                    value={data.interior_number}
                                    onChange={(e) =>
                                        setData(
                                            "interior_number",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Núm. int. (opcional)"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.interior_number}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Código postal */}
                <div>
                    <InputLabel htmlFor="postal_code" value="Código postal" />
                    <TextInput
                        id="postal_code"
                        className="mt-1 block w-full"
                        value={data.postal_code}
                        onChange={(e) => setData("postal_code", e.target.value)}
                        placeholder="Ejemplo: 01000"
                        required
                    />
                    <InputError className="mt-2" message={errors.postal_code} />
                </div>

                {/* Número de teléfono */}
                <div>
                    <InputLabel htmlFor="phone" value="Número de teléfono" />
                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        placeholder="+52"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Puede ser utilizado durante la entrega
                    </p>
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                {/* Instrucciones de entrega */}
                <div>
                    <InputLabel
                        htmlFor="delivery_instructions"
                        value="Instrucciones de entrega (opcional)"
                    />
                    <textarea
                        id="delivery_instructions"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.delivery_instructions}
                        onChange={(e) =>
                            setData("delivery_instructions", e.target.value)
                        }
                        rows={3}
                        placeholder="¿Se necesita un código de seguridad o un número de teléfono para acceder al edificio?"
                    />
                    <InputError
                        className="mt-2"
                        message={errors.delivery_instructions}
                    />
                </div>

                {/* Código de seguridad */}
                {data.delivery_instructions && (
                    <div>
                        <InputLabel
                            htmlFor="security_code"
                            value="Código de seguridad (opcional)"
                        />
                        <TextInput
                            id="security_code"
                            className="mt-1 block w-full"
                            value={data.security_code}
                            onChange={(e) =>
                                setData("security_code", e.target.value)
                            }
                            placeholder="Ejemplo: 1234"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.security_code}
                        />
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        Guardar Dirección
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
