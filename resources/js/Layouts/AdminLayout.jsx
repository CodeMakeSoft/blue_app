import React from "react";
import { Sidebar } from "@/Components/Sidebar";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    UsersIcon,
    TagIcon,
    CubeIcon,
    Squares2X2Icon,
    BriefcaseIcon,
    KeyIcon,
    ClipboardDocumentListIcon,
    UserCircleIcon,
} from "@heroicons/react/24/solid";
import AuthenticatedLayout from "./AuthenticatedLayout";

export default function AdminLayout({ children, header, activeRoute }) {
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

    // Determinar si mostrar el dropdown basado en si tiene acceso a alguna de las opciones
    const shouldShowRolesDropdown =
        canAccessRolesAndPermissions &&
        (userCanManageUsers || userCanManageRoles || userCanManagePermissions);

    // Determinar la ruta activa para el dropdown
    const isRolesActive =
        activeRoute === "users.index" ||
        activeRoute === "roles.index" ||
        activeRoute === "permissions.index" ||
        activeRoute?.startsWith("users.") ||
        activeRoute?.startsWith("roles.") ||
        activeRoute?.startsWith("permissions.");

    return (
        <AuthenticatedLayout header={header}>
            <div className="flex h-full bg-transparent">
                {/* Sidebar */}
                <Sidebar>
                    {shouldShowRolesDropdown && (
                        <Sidebar.Item
                            icon={<UsersIcon className="h-5 w-5" />}
                            text="Roles and permissions"
                            active={isRolesActive}
                        >
                            {userCanManageUsers && (
                                <Link href={route("users.index")}>
                                    <UserCircleIcon className="h-5 w-5 mr-2" />{" "}
                                    Users
                                </Link>
                            )}
                            {userCanManageRoles && (
                                <Link href={route("roles.index")}>
                                    <BriefcaseIcon className="h-5 w-5 mr-2" />{" "}
                                    Roles
                                </Link>
                            )}
                            {userCanManagePermissions && (
                                <Link href={route("permissions.index")}>
                                    <KeyIcon className="h-5 w-5 mr-2" />{" "}
                                    Permissions
                                </Link>
                            )}
                        </Sidebar.Item>
                    )}

                    <Sidebar.Item
                        icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
                        text="Manage E-commerce"
                        active={
                            activeRoute === "category.index" ||
                            activeRoute === "brand.index" ||
                            activeRoute === "products.index" ||
                            activeRoute?.startsWith("category.") ||
                            activeRoute?.startsWith("brand.") ||
                            activeRoute?.startsWith("products.")
                        }
                    >
                        <Link href={route("category.index")}>
                            <Squares2X2Icon className="h-5 w-5 mr-2" />{" "}
                            Categories
                        </Link>
                        <Link href={route("brand.index")}>
                            <TagIcon className="h-5 w-5 mr-2" /> Brands
                        </Link>
                        <Link href={route("products.index")}>
                            <CubeIcon className="h-5 w-5 mr-2" /> Products
                        </Link>
                    </Sidebar.Item>
                </Sidebar>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="py-6">{children}</div>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
