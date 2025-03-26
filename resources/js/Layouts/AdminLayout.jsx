import React from "react";
import Sidebar, { SidebarItem } from "@/Components/Sidebar";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
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

export default function AdminLayout({ children, activeRoute }) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}  
            <Sidebar>
                
                <SidebarItem
                    icon={<UsersIcon className="h-5 w-5" />}
                    text="Roles and permissions"
                    active={activeRoute === "roles"}
                >
                    <button
                        className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                        onClick={() => Inertia.visit(route("users.index"))}
                    >
                        <UserCircleIcon className="h-5 w-5 mr-2" />{" "}
                        <span>Users</span>{" "}
                    </button>
                    <button
                        className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                        onClick={() => Inertia.visit(route("roles.index"))}
                    >
                        <BriefcaseIcon className="h-5 w-5 mr-2" />{" "}
                        <span>Roles</span>{" "}
                    </button>
                    <button
                        className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                        onClick={() =>
                            Inertia.visit(route("permissions.index"))
                        }
                    >
                        <KeyIcon className="h-5 w-5 mr-2" />{" "}
                        <span>Permissions</span>{" "}
                    </button>
                </SidebarItem>
                <SidebarItem
                    icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
                    text="Manage E-commerce"
                    active={activeRoute === "ecommerce"}
                >
                    <button
                        className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                        onClick={() => Inertia.visit(route("categories.index"))}
                    >
                        <Squares2X2Icon className="h-5 w-5 mr-2" />{" "}
                        <span>Categories</span>{" "}
                    </button>
                    <button
                        className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                        onClick={() => Inertia.visit(route("brands.index"))}
                    >
                        <TagIcon className="h-5 w-5 mr-2" /> <span>Brands</span>{" "}
                    </button>
                    <button
                        className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                        onClick={() => Inertia.visit(route("products.index"))}
                    >
                        <CubeIcon className="h-5 w-5 mr-2" />{" "}
                        <span>Products</span>{" "}
                    </button>
                </SidebarItem>
            </Sidebar>

            {/* Contenido principal */}
            <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {children}
            </main>
        </div>
    );
}
