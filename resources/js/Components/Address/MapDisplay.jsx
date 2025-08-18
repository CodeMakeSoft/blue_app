import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

export default function MapDisplay({
    lat,
    lng,
    postalCode,
    country,
    zoom = 4,
}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [mapError, setMapError] = useState("");
    const [mapLoaded, setMapLoaded] = useState(false);

    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    useEffect(() => {
        if (!lat || !lng || !apiKey) {
            if (!apiKey) {
                setMapError("Clave de API de MapTiler no configurada");
            }
            return;
        }

        const initializeMap = () => {
            try {
                if (map.current) {
                    map.current.remove();
                    map.current = null;
                }

                map.current = new maplibregl.Map({
                    container: mapContainer.current,
                    style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
                    center: [lng, lat],
                    zoom: zoom,
                    maxZoom: 18,
                    minZoom: 2,
                });

                map.current.addControl(
                    new maplibregl.NavigationControl(),
                    "top-right"
                );
                map.current.addControl(
                    new maplibregl.ScaleControl({ unit: "metric" }),
                    "bottom-left"
                );

                const markerElement = document.createElement("div");
                markerElement.className = "custom-marker";
                markerElement.style.cssText = `
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: #3b82f6;
                    border: 3px solid white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                marker.current = new maplibregl.Marker({
                    element: markerElement,
                    anchor: "center",
                })
                    .setLngLat([lng, lat])
                    .addTo(map.current);

                const popup = new maplibregl.Popup({
                    offset: 25,
                    closeButton: false,
                    closeOnClick: false,
                }).setLngLat([lng, lat]).setHTML(`
                    <div style="padding: 8px; font-size: 12px; line-height: 1.4;">  
                        <strong>📍 Ubicación aproximada</strong><br>  
                        <span style="color: #666;">CP: ${postalCode}</span><br>
                        <span style="color: #666;">${country}</span>    
                    </div>
                `);

                markerElement.addEventListener("mouseenter", () =>
                    popup.addTo(map.current)
                );
                markerElement.addEventListener("mouseleave", () =>
                    popup.remove()
                );

                map.current.on("load", () => {
                    setMapLoaded(true);
                    setMapError("");

                    map.current.addSource("postal-area", {
                        type: "geojson",
                        data: {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [lng, lat],
                            },
                        },
                    });

                    map.current.addLayer({
                        id: "postal-area-circle",
                        type: "circle",
                        source: "postal-area",
                        paint: {
                            "circle-radius": 100,
                            "circle-color": "#3b82f6",
                            "circle-opacity": 0.1,
                            "circle-stroke-width": 1,
                            "circle-stroke-color": "#3b82f6",
                            "circle-stroke-opacity": 0.3,
                        },
                    });
                });

                map.current.on("error", (e) => {
                    console.error("Error en MapTiler:", e);
                    setMapError("Error al cargar el mapa");
                    setMapLoaded(false);
                });
            } catch (error) {
                console.error("Error inicializando mapa:", error);
                setMapError("Error al inicializar el mapa");
                setMapLoaded(false);
            }
        };

        initializeMap();

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [lat, lng, apiKey, postalCode, country, zoom]);

    useEffect(() => {
        if (map.current && marker.current && lat && lng) {
            const newCenter = [lng, lat];
            map.current.flyTo({
                center: newCenter,
                zoom: zoom,
                duration: 1000,
            });
            marker.current.setLngLat(newCenter);
        }
    }, [lat, lng, zoom]);

    if (!apiKey) {
        return (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                    ⚠️ Para mostrar el mapa, configure la variable de entorno
                    VITE_MAPTILER_API_KEY
                </p>
            </div>
        );
    }

    if (mapError) {
        return (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">❌ {mapError}</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
                
                {!mapLoaded && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Cargando mapa...
                    </div>
                )}
            </div>

            <div className="relative">
                <div
                    ref={mapContainer}
                    className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden"
                />

                {!mapLoaded && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Cargando mapa...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
