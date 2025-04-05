import ApplicationLogo from "@/Components/ApplicationLogo";
import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import { Sidebar } from "@/Components/Sidebar";
import Footer from "@/Components/Footer";
import { HomeIcon, SwatchIcon } from "@heroicons/react/24/solid";
import ThemeSwitcher from "@/Components/ThemeSwitcher";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const menuItems = [
        {
            href: route("dashboard"),
            icon: (
                <HomeIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ),
            text: "Inicio",
            active: route().current("dashboard"),
        },
        {
            href: route("products.index2"),
            icon: (
                <SwatchIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ),
            text: "Productos",
            active: route().current("products.index2"),
        },
        {
            href: route("products.index"),
            icon: (
                <SwatchIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ),
            text: "Crear Productos",
            active: route().current("products.index"),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-1">
                <Sidebar>
                    {menuItems.map((item, index) => (
                        <Sidebar.Item
                            key={index}
                            href={item.href}
                            icon={item.icon}
                            text={item.text}
                            active={item.active}
                        />
                    ))}
                </Sidebar>

                <div className="flex-1 flex flex-col">
                    <nav className="border-b border-gray-100 bg-white dark:bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between">
                                <div className="flex">
                                    <div className="flex shrink-0 items-center">
                                        <Link href="/">
                                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <ThemeSwitcher />
                                </div>
                            </div>
                        </div>
                    </nav>

                    {header && (
                        <header className="bg-white dark:bg-gray-800 shadow">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="flex-1 p-4 bg-white dark:bg-gray-800">
                        {children}
                    </main>
                </div>
            </div>

            {auth.user && <Footer />}
        </div>
    );
}
