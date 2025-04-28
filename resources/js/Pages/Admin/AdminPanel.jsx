import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ChartPieIcon,
    UsersIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
    TagIcon,
    CubeIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function AdminPanel({ activeRoute }) {
    const adminFeatures = [
        {
            title: "Gestión de Usuarios",
            description: "Administra usuarios, roles y permisos del sistema",
            icon: <UsersIcon className="h-8 w-8 text-blue-500" />,
            route: "users.index",
        },
        {
            title: "Gestión de Roles",
            description: "Configura roles y niveles de acceso",
            icon: <ShieldCheckIcon className="h-8 w-8 text-green-500" />,
            route: "roles.index",
        },
        {
            title: "Gestión de Permisos",
            description: "Controla permisos y accesos específicos",
            icon: <ShieldCheckIcon className="h-8 w-8 text-purple-500" />,
            route: "permissions.index",
        },
        {
            title: "Gestión de Categorías",
            description: "Administra las categorías de tus productos",
            icon: <TagIcon className="h-8 w-8 text-indigo-500" />,
            route: "category.index",
        },
        {
            title: "Gestión de Marcas",
            description: "Administra las marcas de tus productos",
            icon: <ShoppingBagIcon className="h-8 w-8 text-amber-500" />,
            route: "brand.index",
        },
        {
            title: "Gestión de Productos",
            description: "Gestiona tu catálogo de productos",
            icon: <CubeIcon className="h-8 w-8 text-emerald-500" />,
            route: "products.index",
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

            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Bienvenido al centro de control administrativo
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Desde aquí puedes gestionar todos los aspectos de tu
                        plataforma
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminFeatures.map((feature, index) => (
                        <Link
                            key={index}
                            href={route(feature.route)}
                            className={`group block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:ring-2 hover:ring-blue-500 hover:bg-blue-50/50 dark:hover:bg-gray-700 cursor-pointer ${feature.color}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={`rounded-full p-3 mb-4 ${feature.color} group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30`}
                                >
                                    {feature.icon}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {feature.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                    {feature.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
