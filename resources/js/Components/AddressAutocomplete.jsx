import React, { useState, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { usePage } from "@inertiajs/inertia-react";

const AddressAutocomplete = ({ onAddressSelect }) => {
    const { props } = usePage();
    const [autocomplete, setAutocomplete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verificar si la API key está disponible en las props de Inertia
        if (props.googleMapsApiKey) {
            setLoading(false);
            return;
        }

        // Si no está en las props, hacer fetch
        axios
            .get("/google-api-key")
            .then((response) => {
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching Google API key:", error);
                setError("Error al cargar el servicio de direcciones");
                setLoading(false);
            });
    }, []);

    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (!autocomplete) return;

        const place = autocomplete.getPlace();
        if (!place.address_components || !place.formatted_address) {
            return;
        }

        const addressComponents = {
            street_number: "",
            route: "",
            locality: "",
            administrative_area_level_1: "",
            country: "",
            postal_code: "",
            formatted_address: place.formatted_address,
        };

        place.address_components.forEach((component) => {
            const typeMap = {
                street_number: "street_number",
                route: "route",
                locality: "locality",
                administrative_area_level_1: "administrative_area_level_1",
                country: "country",
                postal_code: "postal_code",
            };

            Object.entries(typeMap).forEach(([key, type]) => {
                if (component.types.includes(type)) {
                    addressComponents[key] = component.long_name;
                }
            });
        });

        onAddressSelect({
            street: `${addressComponents.street_number} ${addressComponents.route}`.trim(),
            city: addressComponents.locality,
            state: addressComponents.administrative_area_level_1,
            country: addressComponents.country,
            postal_code: addressComponents.postal_code,
            formatted_address: place.formatted_address,
        });
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (loading) {
        return <div>Cargando servicio de direcciones...</div>;
    }

    return (
        <LoadScript
            googleMapsApiKey={props.googleMapsApiKey || ""}
            libraries={["places"]}
            loadingElement={<div>Cargando mapa...</div>}
        >
            <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
                options={{
                    types: ["address"],
                    fields: ["address_components", "formatted_address"],
                }}
            >
                <input
                    type="text"
                    placeholder="Ingresa tu dirección"
                    className="form-control w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </Autocomplete>
        </LoadScript>
    );
};

export default AddressAutocomplete;
