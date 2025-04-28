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
        <AuthenticatedLayout header={header}>
            <div className="flex h-full bg-transparent">
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
                            <Squares2X2Icon className="h-5 w-5 mr-2" /> Categories
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