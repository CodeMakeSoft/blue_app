import Sidebar, { SidebarItem } from '@/Components/Sidebar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import {
    UsersIcon,
    HomeIcon
} from "@heroicons/react/24/solid";
import Dropdown from '@/Components/Dropdown';

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
                        icon={<HomeIcon className="h-5 w-5" />}
                        text="Home"
                    />
                    <SidebarItem
                        icon={<UsersIcon className="h-5 w-5" />}
                        text="Users"
                    >
                        
                    </SidebarItem>
                </Sidebar>
            </div>
        </AuthenticatedLayout>
    );
}
