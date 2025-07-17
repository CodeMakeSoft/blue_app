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
    const [filters, setFilters] = useState({
        product: "",
        productId: null,
        brand: "",
        category: "",
        start_date: "",
        end_date: "",
    });

    const [suggestions, setSuggestions] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));

        if (name === "product" && value.length >= 2) {
            axios
                .get("/admin/statistics/autocomplete", {
                    params: { term: value },
                })
                .then((res) => setSuggestions(res.data));
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

    const fetchSalesData = () => {
        axios
            .get("/admin/statistics/sales-data", {
                params: {
                    start_date: filters.start_date,
                    end_date: filters.end_date,
                    product_id: filters.productId,
                    brand_id: filters.brand,
                    category_id: filters.category,
                },
            })
            .then((res) => {
                const data = res.data;
                setChartData({
                    labels: data.map((item) => item.date),
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

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchSalesData();
    };

    useEffect(() => {
        fetchSalesData();
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

                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Marca (ID)
                            </label>
                            <input
                                name="brand"
                                value={filters.brand}
                                onChange={handleChange}
                                type="text"
                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Categoría (ID)
                            </label>
                            <input
                                name="category"
                                value={filters.category}
                                onChange={handleChange}
                                type="text"
                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
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
                        </div>
                    </form>
                </div>

                {/* TÍTULO Y GRÁFICO */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Estadísticas de Ventas
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Ventas por Día",
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
