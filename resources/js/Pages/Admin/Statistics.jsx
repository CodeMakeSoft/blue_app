import { Head } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import AdminLayout from '@/Layouts/AdminLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Statistics({ activeRoute }) {
    const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
        datasets: [
            {
                label: 'Ventas',
                data: [1200, 1500, 1000, 1900],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ventas por Mes' },
        },
    };

    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="Estadísticas" />

            <div className="p-6 space-y-6">
                {/* FILTROS */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Filtrar estadísticas</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log('Enviar filtros...');
                        }}
                        className="grid md:grid-cols-4 gap-4"
                    >
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Producto
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Marca
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Categoría
                            </label>
                            <input
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
                                    className="w-1/2 px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="date"
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
                    <Bar data={data} options={options} />
                </div>
            </div>
        </AdminLayout>
    );
}