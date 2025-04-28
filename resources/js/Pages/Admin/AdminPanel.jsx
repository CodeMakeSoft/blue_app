// resources/js/Pages/Admin/AdminPanel.jsx
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { ChartPieIcon, UsersIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";


export default function AdminPanel({ activeRoute }) {
    const adminFeatures = [
        {
            title: "Gestión de Usuarios",
            description: "Administra usuarios, roles y permisos del sistema",
            icon: <UsersIcon className="h-8 w-8 text-blue-500" />,
        },
        {
            title: "Gestión de Roles y Permisos",
            description: "Visualiza estadísticas y métricas importantes",
            icon: <ShieldCheckIcon className="h-8 w-8 text-green-500" />,
        },
        {
            title: "Gestiíon de e-commerce",
            description: "Define y asigna permisos específicos para cada rol",
            icon: <ChartPieIcon className="h-8 w-8 text-purple-500" />,
        },
    ];

    return (
        <AdminLayout
                    activeRoute={activeRoute}
                    header={
                        <div>
                            <Breadcrumb
                                routes={[{ name: "Inicio", link: route("dashboard") }]}
                                currentPage="Panel de Administración"
                            />
                            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight mt-2">
                                Panel de Administración
                            </h2>
                        </div>
                    }
                >
            <Head title="Panel de Administración" />
            
            <div className=" space-y-6">
                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Bienvenido al centro de control administrativo
                    </h1>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminFeatures.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-transform hover:scale-105 duration-300"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-full p-3 mb-4">
                                    {feature.icon}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                    {feature.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
