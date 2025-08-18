import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ChartPieIcon,
    UsersIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
    TagIcon,
    CubeIcon,
} from "@heroicons/react/24/outline";
import Breadcrumb from "@/Components/Breadcrumb";

export default function AdminPanel({ activeRoute }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Debug - ver qué datos llegan
    console.log("Auth data:", auth);
    console.log("User roles:", user?.roles);
    console.log("Active route:", activeRoute);

    // Obtener roles del usuario - asegurarse de que sea un array de strings
    const userRoles = user?.roles
        ? Array.isArray(user.roles)
            ? user.roles
            : user.roles.map((role) => role.name || role)
        : [];

    // Helper function para verificar roles
    const hasRole = (role) => {
        // Verificar tanto minúsculas como el formato original
        return (
            userRoles.includes(role) ||
            userRoles.includes(role.toLowerCase()) ||
            userRoles.some(
                (userRole) =>
                    (typeof userRole === "string"
                        ? userRole
                        : userRole.name
                    )?.toLowerCase() === role.toLowerCase()
            )
        );
    };

    // Verificar acceso a roles y permisos
    const canAccessRolesAndPermissions =
        hasRole("SuperAdmin") || hasRole("Admin");

    // Verificar permisos específicos (si están disponibles)
    const userPermissions = user?.permissions || [];
    const hasPermission = (permission) => {
        return (
            userPermissions.includes(permission) ||
            userPermissions.some(
                (perm) =>
                    (typeof perm === "string" ? perm : perm.name) === permission
            )
        );
    };

    // Permisos específicos para cada sección
    const userCanManageUsers =
        hasPermission("user-view") || hasRole("SuperAdmin") || hasRole("Admin");
    
    const userCanManageRoles =
        hasPermission("role-view") || hasRole("SuperAdmin");
    
    const userCanManagePermissions =
        hasPermission("permission-view") || hasRole("SuperAdmin");
    
    const userCanManageProducts =
        hasPermission("product-view") ||
        hasRole("SuperAdmin") ||
        hasRole("Admin") ||
        hasRole("Seller");
    
    const userCanManageBrands =
        hasPermission("brand-view") ||
        hasRole("SuperAdmin") ||
        hasRole("Admin") ||
        hasRole("Seller");
    
    const userCanManageCategories =
        hasPermission("category-view") ||
        hasRole("SuperAdmin") ||
        hasRole("Admin") ||
        hasRole("Seller");

    // Debug - mostrar permisos calculados
    console.log("Calculated permissions:", {
        userCanManageUsers,
        userCanManageRoles,
        userCanManagePermissions,
        userCanManageProducts,
        userCanManageBrands,
        userCanManageCategories,
    });

    const adminFeatures = [
        {
            title: "Gestión de Usuarios",
            description: "Administra usuarios del sistema",
            icon: <UsersIcon className="h-8 w-8 text-green-500" />,
            route: "users.index",
            show: userCanManageUsers,
        },
        {
            title: "Gestión de Roles",
            description: "Administra roles del sistema",
            icon: <ShieldCheckIcon className="h-8 w-8 text-purple-500" />,
            route: "roles.index",
            show: userCanManageRoles,
        },
        {
            title: "Gestión de Permisos",
            description: "Administra permisos del sistema",
            icon: <ShieldCheckIcon className="h-8 w-8 text-yellow-500" />,
            route: "permissions.index",
            show: userCanManagePermissions,
        },
        {
            title: "Gestión de Productos",
            description: "Administra productos del catálogo",
            icon: <ShoppingBagIcon className="h-8 w-8 text-red-500" />,
            route: "products.index",
            show: userCanManageProducts,
        },
        {
            title: "Gestión de Categorías",
            description: "Administra categorías de productos",
            icon: <TagIcon className="h-8 w-8 text-indigo-500" />,
            route: "category.index",
            show: userCanManageCategories,
        },
        {
            title: "Gestión de Marcas",
            description: "Administra las marcas de tus productos",
            icon: <CubeIcon className="h-8 w-8 text-amber-500" />,
            route: "brand.index",
            show: userCanManageBrands,
        },
        {
            title: "Estadísticas del Sistema",
            description: "Visualiza métricas de ventas y productos",
            icon: <ChartPieIcon className="h-8 w-8 text-orange-500" />,
            route: "admin.statistics.index",
            show: true, // Mostrar siempre o agregar lógica específica
        },
    ];

    // FILTRAR las características basadas en la propiedad 'show'
    const visibleFeatures = adminFeatures.filter((feature) => feature.show);

    // Debug - mostrar características visibles
    console.log(
        "Visible features:",
        visibleFeatures.map((f) => f.title)
    );

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

                {/* Features Grid - USAR visibleFeatures en lugar de adminFeatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleFeatures.length > 0 ? (
                        visibleFeatures.map((feature, index) => (
                            <Link
                                key={index}
                                href={route(feature.route)}
                                className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:ring-2 hover:ring-blue-500 hover:bg-blue-50/50 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="rounded-full p-3 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
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
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                No tienes permisos para acceder a ninguna
                                función administrativa.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
