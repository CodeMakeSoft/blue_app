import React from "react";
import { Sidebar } from "@/Components/Sidebar";
import { Head, Link } from "@inertiajs/react";
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
    return (
        <AuthenticatedLayout>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800 mt-[6rem]">
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <Sidebar>
                    <Sidebar.Item
                        icon={<UsersIcon className="h-5 w-5" />}
                        text="Roles and permissions"
                        active={activeRoute === "roles"}
                    >
                        <Link href={route("users.index")}>
                            <UserCircleIcon className="h-5 w-5 mr-2" /> Users
                        </Link>
                        <Link href={route("roles.index")}>
                            <BriefcaseIcon className="h-5 w-5 mr-2" /> Roles
                        </Link>
                        <Link href={route("permissions.index")}>
                            <KeyIcon className="h-5 w-5 mr-2" /> Permissions
                        </Link>
                    </Sidebar.Item>
                    <Sidebar.Item
                        icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
                        text="Manage E-commerce"
                        active={activeRoute === "ecommerce"}
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

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-6xl">
                        {header && <div className="px-6 pt-4">{header}</div>}
                        <div className="px-6 pb-6">{children}</div>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}