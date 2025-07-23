import { Head } from "@inertiajs/react";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
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
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Statistics({ activeRoute }) {
    const [filters, setFilters] = useState({
        product: "",
        productId: null,
        brand: "",
        brandId: null,
        category: "",
        categoryId: null,
        start_date: "",
        end_date: "",
    });

    const [suggestions, setSuggestions] = useState([]);
    const [brandSuggestions, setBrandSuggestions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);
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

        if (name === "product" && value.length >= 2) {
            axios
                .get("/admin/statistics/autocomplete", {
                    params: { term: value },
                })
                .then((res) => setSuggestions(res.data));
        }

        if (name === "brand" && value.length >= 2) {
            axios
                .get("/admin/statistics/search-brands", {
                    params: { q: value },
                })
                .then((res) => setBrandSuggestions(res.data));
        }

        if (name === "category" && value.length >= 2) {
            axios
                .get("/admin/statistics/search-categories", {
                    params: { q: value },
                })
                .then((res) => setCategorySuggestions(res.data));
        }

        if (name === "brand" && value.length < 2) {
            setBrandSuggestions([]);
            setFilters((prev) => ({ ...prev, brandId: null }));
        }

        if (name === "category" && value.length < 2) {
            setCategorySuggestions([]);
            setFilters((prev) => ({ ...prev, categoryId: null }));
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

    const handleCategoryClick = (category) => {
        setFilters((prev) => ({
            ...prev,
            category: category.name,
            categoryId: category.id,
        }));
        setCategorySuggestions([]);
    };

    const fetchSalesData = () => {
        axios
            .get("/admin/statistics/sales-data", {
                params: {
                    start_date: filters.start_date,
                    end_date: filters.end_date,
                    product_id: filters.productId,
                    brand_id: filters.brandId,
                    category_id: filters.categoryId,
                },
            })
            .then((res) => {
                const data = res.data;
                setSalesChartData({
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

    const fetchBrandData = () => {
        axios
            .get("/admin/statistics/sales-by-brand", {
                params: {
                    start_date: filters.start_date,
                    end_date: filters.end_date,
                },
            })
            .then((res) => {
                const data = res.data;
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
                const data = res.data;
                console.log("Top products data:", data); // 👈 Diagnóstico
                setProductChartData({
                    labels: data.map((item) => item.name), // ✅ usa directamente name

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
            start_date: filters.start_date,
            end_date: filters.end_date,
        });

        if (filters.productId) params.append("product_id", filters.productId);
        if (filters.brandId) params.append("brand_id", filters.brandId);
        if (filters.categoryId)
            params.append("category_id", filters.categoryId);

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
        fetchSalesData();
        fetchBrandData();
        fetchTopProducts();
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

                        {/* Categoría */}
                        <div className="relative">
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Categoría
                            </label>
                            <input
                                name="category"
                                value={filters.category}
                                onChange={handleChange}
                                type="text"
                                autoComplete="off"
                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                            {categorySuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto dark:bg-gray-800">
                                    {categorySuggestions.map((item) => (
                                        <li
                                            key={item.id}
                                            onClick={() =>
                                                handleCategoryClick(item)
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
                                        start_date: filters.start_date,
                                        end_date: filters.end_date,
                                        product_id: filters.productId ?? "",
                                        brand_id: filters.brandId ?? "",
                                        category_id: filters.categoryId ?? "",
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

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <Bar
                        data={salesChartData}
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

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <Bar
                        data={brandChartData}
                        options={{
                            responsive: true,
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

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <Bar
                        data={productChartData}
                        options={{
                            responsive: true,
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
        </AdminLayout>
    );
}
