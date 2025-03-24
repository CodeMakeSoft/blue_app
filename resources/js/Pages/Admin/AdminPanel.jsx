import Sidebar, { SidebarItem } from '@/Components/Sidebar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head} from "@inertiajs/react"; 
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
    UserCircleIcon
} from "@heroicons/react/24/solid";

export default function AdminPanel() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Panel
                </h2>
            }
        >
            <Head title="AdminPanel" />

            <div className="flex min-h-screen">
                <Sidebar>
                    <SidebarItem
                        icon={<UsersIcon className="h-5 w-5" />}
                        text="Roles and permissions"
                    >
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                console.log("Navegar a Lista de usuarios")
                            }
                        >
                            <UserCircleIcon className="h-5 w-5 mr-2" />{" "}
                            <span>Users</span>{" "}
                        </button>
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                console.log("Navegar a Lista de usuarios")
                            }
                        >
                            <BriefcaseIcon className="h-5 w-5 mr-2" />{" "}
                            <span>Roles</span>{" "}
                        </button>
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                console.log("Navegar a Lista de usuarios")
                            }
                        >
                            <KeyIcon className="h-5 w-5 mr-2" />{" "}
                            <span>Permissions</span>{" "}
                        </button>
                    </SidebarItem>
                    <SidebarItem
                        icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
                        text="Manage E-commerce"
                    >
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                Inertia.visit(route("categories.index"))
                            }
                        >
                            <Squares2X2Icon className="h-5 w-5 mr-2" />{" "}
                            <span>Categories</span>{" "}
                        </button>
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                console.log("Navegar a Lista de usuarios")
                            }
                        >
                            <TagIcon className="h-5 w-5 mr-2" />{" "}
                            <span>Brands</span>{" "}
                        </button>
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                console.log("Navegar a Lista de usuarios")
                            }
                        >
                            <CubeIcon className="h-5 w-5 mr-2" />{" "}
                            <span>Products</span>{" "}
                        </button>
                    </SidebarItem>
                </Sidebar>
            </div>
        </AuthenticatedLayout>
    );
}
