import { Head } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import AdminLayout from "@/Layouts/AdminLayout";
import { useEffect, useState } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Statistics({ activeRoute }) {
    // ✅ Filtros sin categoría
    const [filters, setFilters] = useState({
        product: "",
        productId: null,
        brand: "",
        brandId: null,
        start_date: "",
        end_date: "",
    });

    const [suggestions, setSuggestions] = useState([]);
    const [brandSuggestions, setBrandSuggestions] = useState([]);

    const [salesChartData, setSalesChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [brandChartData, setBrandChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [productChartData, setProductChartData] = useState({
        labels: [],
        datasets: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));

        // 🔎 Autocomplete producto
        if (name === "product") {
            if (value.length >= 2) {
                axios
                    .get("/admin/statistics/autocomplete", {
                        params: { term: value },
                    })
                    .then((res) => setSuggestions(res.data));
            } else {
                setSuggestions([]);
                setFilters((prev) => ({ ...prev, productId: null }));
            }
        }

        // 🔎 Autocomplete marca
        if (name === "brand") {
            if (value.length >= 2) {
                axios
                    .get("/admin/statistics/search-brands", {
                        params: { q: value },
                    })
                    .then((res) => setBrandSuggestions(res.data));
            } else {
                setBrandSuggestions([]);
                setFilters((prev) => ({ ...prev, brandId: null }));
            }
        }
    };

    const handleSuggestionClick = (product) => {
        setFilters((prev) => ({
            ...prev,
            product: product.name,
            productId: product.id,
        }));
        setSuggestions([]);
    };

    const handleBrandClick = (brand) => {
        setFilters((prev) => ({
            ...prev,
            brand: brand.name,
            brandId: brand.id,
        }));
        setBrandSuggestions([]);
    };

    // ✅ Ventas con agrupación dinámica (día/semana/mes) → backend devuelve { label, total }
    const fetchSalesData = () => {
        axios
            .get("/admin/statistics/sales-data", {
                params: {
                    start_date: filters.start_date,
                    end_date: filters.end_date,
                    product_id: filters.productId,
                    brand_id: filters.brandId,
                },
            })
            .then((res) => {
                const data = res.data || [];
                setSalesChartData({
                    labels: data.map((item) => item.label ?? item.date), // por compatibilidad
                    datasets: [
                        {
                            label: "Ventas",
                            data: data.map((item) => item.total),
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                        },
                    ],
                });
            });
    };

    const fetchBrandData = () => {
        axios
            .get("/admin/statistics/sales-by-brand", {
                params: {
                    start_date: filters.start_date,
                    end_date: filters.end_date,
                },
            })
            .then((res) => {
                const data = res.data || [];
                setBrandChartData({
                    labels: data.map((item) => item.name),
                    datasets: [
                        {
                            label: "Ventas por Marca",
                            data: data.map((item) => item.total_sold),
                            backgroundColor: "rgba(255, 159, 64, 0.6)",
                        },
                    ],
                });
            });
    };

    const fetchTopProducts = () => {
        axios
            .get("/admin/statistics/top-products", {
                params: {
                    start_date: filters.start_date,
                    end_date: filters.end_date,
                },
            })
            .then((res) => {
                const data = res.data || [];
                setProductChartData({
                    labels: data.map((item) => item.name),
                    datasets: [
                        {
                            label: "Productos más vendidos",
                            data: data.map((item) => item.total_sold),
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                        },
                    ],
                });
            })
            .catch((err) => {
                console.error("Error cargando top products:", err);
            });
    };

    const exportCSV = () => {
        const params = new URLSearchParams({
            start_date: filters.start_date ?? "",
            end_date: filters.end_date ?? "",
        });

        if (filters.productId) params.append("product_id", filters.productId);
        if (filters.brandId) params.append("brand_id", filters.brandId);

        const url = `/admin/statistics/export-csv?${params.toString()}`;
        window.open(url, "_blank");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchSalesData();
        fetchBrandData();
        fetchTopProducts();
    };

    useEffect(() => {
        // Carga inicial
        fetchSalesData();
        fetchBrandData();
        fetchTopProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="Estadísticas" />

            <div className="p-6 space-y-6">
                {/* FILTROS */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">
                        Filtrar estadísticas
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-4 gap-4 relative"
                    >
                        {/* Producto */}
                        <div className="relative">
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Producto
                            </label>
                            <input
                                name="product"
                                value={filters.product}
                                onChange={handleChange}
                                type="text"
                                autoComplete="off"
                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto dark:bg-gray-800">
                                    {suggestions.map((item) => (
                                        <li
                                            key={item.id}
                                            onClick={() =>
                                                handleSuggestionClick(item)
                                            }
                                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                        >
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Marca */}
                        <div className="relative">
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Marca
                            </label>
                            <input
                                name="brand"
                                value={filters.brand}
                                onChange={handleChange}
                                type="text"
                                autoComplete="off"
                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                            {brandSuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto dark:bg-gray-800">
                                    {brandSuggestions.map((item) => (
                                        <li
                                            key={item.id}
                                            onClick={() =>
                                                handleBrandClick(item)
                                            }
                                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                        >
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Fechas */}
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Rango de fechas
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    name="start_date"
                                    value={filters.start_date}
                                    onChange={handleChange}
                                    className="w-1/2 px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="date"
                                    name="end_date"
                                    value={filters.end_date}
                                    onChange={handleChange}
                                    className="w-1/2 px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-4 text-right">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Aplicar filtros
                            </button>
                            <button
                                type="button"
                                onClick={exportCSV}
                                className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Exportar CSV
                            </button>
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams({
                                        start_date: filters.start_date ?? "",
                                        end_date: filters.end_date ?? "",
                                        product_id: filters.productId ?? "",
                                        brand_id: filters.brandId ?? "",
                                    });
                                    window.open(
                                        `/admin/statistics/export-pdf?${params.toString()}`,
                                        "_blank"
                                    );
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                            >
                                Exportar PDF
                            </button>
                        </div>
                    </form>
                </div>

                {/* GRÁFICOS */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Estadísticas de Ventas
                </h1>

                {/* 🧩 Nuevo organizador: 2 columnas + 1 full width */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ventas por Rango de Tiempo */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[300px]">
                        <Bar
                            data={salesChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false, // ✅ clave para altura fija
                                plugins: {
                                    legend: { position: "top" },
                                    title: {
                                        display: true,
                                        text: "Ventas por Rango de Tiempo",
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            autoSkip: true,
                                            maxRotation: 45,
                                            minRotation: 20,
                                            maxTicksLimit: 14,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Comparativa de Marcas */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[300px]">
                        <Bar
                            data={brandChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "top" },
                                    title: {
                                        display: true,
                                        text: "Comparativa de Marcas",
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Productos más vendidos - Full width */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[300px] md:col-span-2">
                        <Bar
                            data={productChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "top" },
                                    title: {
                                        display: true,
                                        text: "Productos más Vendidos",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
