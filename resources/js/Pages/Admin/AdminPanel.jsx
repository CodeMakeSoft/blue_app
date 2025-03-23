import Sidebar, { SidebarItem } from '@/Components/Sidebar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Accordion, {AccordionItem} from '@/Components/Accordion';
import { Head } from '@inertiajs/react';

import {
    UsersIcon,
    HomeIcon,
    UserPlusIcon,
    KeyIcon
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
            <Head title="Admin Panel" />

            <div className="flex min-h-screen">
                <Sidebar>
                    <SidebarItem
                        icon={<UsersIcon className="h-5 w-5" />}
                        text="Users"
                    >
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                console.log("Navegar a Lista de usuarios")
                            }
                        >
                            <UserPlusIcon className="h-5 w-5 mr-2" />{" "}
                            <span>Roles</span>{" "}
                        </button>
                        <button
                            className="w-full flex items-center text-left p-2 hover:bg-indigo-100 rounded-md"
                            onClick={() =>
                                console.log("Navegar a Lista de usuarios")
                            }
                        >
                            <KeyIcon className="h-5 w-5 mr-2" />{" "}
                            <span>Permisos</span>{" "}
                        </button>
                    </SidebarItem>
                </Sidebar>
            </div>
        </AuthenticatedLayout>
    );
}
