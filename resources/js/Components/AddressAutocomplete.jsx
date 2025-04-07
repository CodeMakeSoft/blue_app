import React, { useState, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";

const AddressAutocomplete = ({ onAddressSelect }) => {
    const [apiKey, setApiKey] = useState("");
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        // Fetch the API key from your Laravel backend
        axios
            .get("/google-api-key")
            .then((response) => {
                setApiKey(response.data.key);
            })
            .catch((error) => {
                console.error("Error fetching Google API key:", error);
            });
    }, []);

    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            // Extract address components
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
                const types = component.types;

                if (types.includes("street_number")) {
                    addressComponents.street_number = component.long_name;
                }
                if (types.includes("route")) {
                    addressComponents.route = component.long_name;
                }
                if (types.includes("locality")) {
                    addressComponents.locality = component.long_name;
                }
                if (types.includes("administrative_area_level_1")) {
                    addressComponents.administrative_area_level_1 =
                        component.short_name;
                }
                if (types.includes("country")) {
                    addressComponents.country = component.long_name;
                }
                if (types.includes("postal_code")) {
                    addressComponents.postal_code = component.long_name;
                }
            });

            // Call the callback function with the selected address
            onAddressSelect(addressComponents);
        }
    };

    if (!apiKey) {
        return <div>Loading...</div>;
    }

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    placeholder="Enter your address"
                    className="form-control"
                    style={{
                        width: "100%",
                        height: "40px",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
            </Autocomplete>
        </LoadScript>
    );
};

export default AddressAutocomplete;
