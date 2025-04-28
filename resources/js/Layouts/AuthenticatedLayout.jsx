import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, useForm } from '@inertiajs/react';
import { useState, lazy, Suspense, useEffect } from 'react';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/solid';
import { Sidebar } from "@/Components/Sidebar";
import { Toaster } from "@/Components/ui/toaster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faBoxOpen,
    faTags,
    faLayerGroup,
    faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const Footer = lazy(() => import('@/Components/Footer'));
const Navbar = lazy(() => import('@/Components/Navbar'));
const ThemeSwitcher = lazy(() => import('@/Components/ThemeSwitcher'));

const mainContentClasses = `
    flex-1 ml-16 p-4 
    bg-white dark:bg-gray-800 
    transition-colors duration-200
`;

const childrenWrapperClasses = `
    flex-1 w-full 
    bg-white dark:bg-gray-800 
    shadow-sm px-4 py-6
    transition-all duration-200
`;

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isCheckoutConfirmVisible, setIsCheckoutConfirmVisible] = useState(false);
    
    // Detecta si estamos en rutas de carrito o checkout
    const { url } = usePage();
    const showCartNavbar = url.startsWith('/cart') || url.startsWith('/checkout') || url.startsWith('/purchases');
    const cart = usePage().props.cart || [];
    const [cartError, setCartError] = useState(false);

    useEffect(() => {
        if (!Array.isArray(cart)) {
            setCartError(true);
            console.error('Cart data is not an array');
        }
    }, [cart]);

    const activeLink = route().current('checkout.index')
        ? 'checkout.index'
        : route().current('cart.index')
        ? 'cart.index'
        : route().current('purchases.index')
        ? 'purchases.index'
        : '';
    const userCanAccessAdminPanel = auth.permissions.includes("can-access-admin-panel");

    // Menú items para Sidebar
    const menuItems = [
        {
            href: route("dashboard"),
            icon: (
                <FontAwesomeIcon
                    icon={faHouse}
                    className="h-5 w-5 text-gray-800 dark:text-gray-200"
                />
            ),
            text: "Inicio",
            active: route().current("dashboard"),
        },
        {
            href: route("products.view"),
            icon: (
                <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="h-5 w-5 text-gray-800 dark:text-gray-200"
                />
            ),
            text: "Productos",
            active: route().current("products.view"),
        },
        {
            href: route("brand.catalog"),
            icon: (
                <FontAwesomeIcon
                    icon={faTags}
                    className="h-5 w-5 text-gray-800 dark:text-gray-200"
                />
            ),
            text: "Marcas",
            active: route().current("brand.catalog"),
        },
        {
            href: route("category.catalog"),
            icon: (
                <FontAwesomeIcon
                    icon={faLayerGroup}
                    className="h-5 w-5 text-gray-800 dark:text-gray-200"
                />
            ),
            text: "Categorías",
            active: route().current("category.catalog"),
        },
        ...(userCanAccessAdminPanel
            ? [
                {
                    href: route("admin.panel"),
                    icon: (
                        <FontAwesomeIcon
                            icon={faUserShield}
                            className="h-5 w-5 text-gray-800 dark:text-gray-200"
                        />
                    ),
                    text: "Admin",
                    active: route().current("admin.panel"),
                },
            ]
        : []),
    ];
    

    // Componente del icono de caja
    const BoxIcon = ({ className }) => (
        <svg
            className={`block h-9 w-auto fill-current ${className}`}
            viewBox="0 0 306.29 304.88"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="m306.16,211.26c.05,4.27-1.48,6.7-5.03,8.77-40.05,23.41-80.04,46.92-120.04,70.42-6.74,3.96-13.54,7.82-20.13,12.02-5.26,3.34-9.96,3.11-15.32-.07-34.48-20.43-69.09-40.64-103.63-60.95-12.18-7.17-24.24-14.53-36.48-21.6C1.59,217.58-.02,214.62,0,210.14c.14-38.27.21-76.53.12-114.8-.01-5.12,1.88-8.17,6.31-10.75,32.05-18.64,63.97-37.51,95.94-56.29,15.06-8.84,30.18-17.58,45.18-26.52,4.05-2.41,7.58-2.34,11.62.04,47.41,27.95,94.86,55.84,142.35,83.66,3.41,2,4.8,4.53,4.77,8.49-.14,19.8-.06,39.6-.06,59.4m-162.06,135.19c1.6.97,3.37.61,3.34-1.76.03-34.6.08-67.6-.11-102.19-.01-1.83-1.76-4.27-3.41-5.37-5.25-3.5-10.83-6.49-16.29-9.68-36.87-21.59-75.2-43.99-112.08-65.55-1.54-.81-4.23-2.1-4.23,1.49,0,34.94-.24,65.49-.39,99.4-.02,4.23,1.5,6.54,5.11,8.64,33.63,19.55,67.15,39.29,100.72,58.95,9.87,5.78,17.08,10.11,27.32,16.05Zm14.68-2.73c0,4.88,2.91,3.16,5.78,1.47,41.16-24.17,82.22-48.49,123.54-72.37,5.62-3.25,7.42-6.84,7.38-12.99-.19-31.78,0-63.56,0-95.34,0-1.48-.48-2.97-.84-5.04-14.53,8.59-28.15,16.87-42.03,24.7-4.1,2.31-5.5,5.08-5.38,9.57.23,8.48.29,16.98-.18,25.45-.13,2.42-1.74,5.72-3.7,6.9-7.96,4.8-16.27,9.05-24.56,13.27-3.5,1.78-6.64.11-7.45-3.79-.43-2.09-.29-4.3-.3-6.46-.03-6.41-.01-12.82-.01-19.42-1.04.15-1.58.08-1.96.3-15.83,9.16-31.7,18.24-47.37,27.68-1.65.99-2.85,4.09-2.86,6.21-.15,27.95-.04,55.91,0,83.86,0,6.28-.07,8.16-.07,15.99ZM21.08,89.39c-1.42,1.12-1.59,3.32.11,4.49,42.41,25,85.76,50.67,128.15,75.72,2.8,1.66,5.09,1.67,7.84.04,14.75-8.71,29.56-17.31,44.34-25.97,2.69-1.58,3.25-3.29.09-5.04-5.24-2.9-10.48-5.78-15.69-8.74-38.33-21.76-76.63-43.56-115.03-65.21-3.18-1.92-5.14-1.84-6.73-.94-15.59,8.87-27.14,16.2-43.07,25.64Zm85.64-50.93c-4.21,2.09-.25,4.18.73,4.89,43.48,24.71,86.99,49.36,130.43,74.13,3.04,1.73,5.47,1.62,8.31-.08,13.13-7.83,26.31-15.57,39.46-23.37,1.2-.71,4.24-2.71-.91-5.43-14.22-8.31-23.04-13.68-36.63-21.67-30.23-17.76-60.43-35.58-90.73-53.21-1.83-1.06-5.1-1.65-6.73-.74-15.45,8.74-27.66,15.9-43.93,25.48Zm124,87.58c-5.43-3.13-9.97-5.78-14.54-8.38-38.56-21.91-79.79-44.82-118.05-67.24-6.7-3.4-5.28-3.67-12.78.39-6,3.26-7.12,5.2-3.48,7.27,43.64,24.73,87.21,49.6,130.87,74.3,1.63.92,4.35,1.31,5.98.6,3.89-1.7,7.42-4.21,12-6.93Zm-8.06,38.61c.03,5.23,4.67.75,11.96-3.83,1.32-.83,1.83-2.3,1.86-3.39.09-6.89,0-11.65.12-18.06,0-5.65-9.83,2.19-12.51,4.23-.81.56-1.4,1.98-1.42,3.02,0,6.12.18,9.84,0,18.02Z" />
            <path d="m168.1,241.82c.37-6.54-.34-5.62,10.81-12.25l18.21-11.02c6.17-3.74,13.14-6.12,13.06,5.09-.05,7.64.11,15.17,0,22.21-.17,4.69.39,4.89-3.72,7.49-9.65,6.15-18.19,10.56-28.2,16.12-6.84,3.44-9.82,2.08-10.16-5.41m30.7-28.25c0-4.21,0-5.33-5.68-1.72-4.06,2.57-7.88,5.21-11.99,7.69-2.69,1.79-1.73,2.38-1.54,12.16.38,3.57.12,3.07,13.02-5.04,5.94-3.86,6.19-3.45,6.19-6.41v-6.67Z" />
        </svg>
    );

    const { data, setData, get } = useForm({
        search: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('dashboard'), { preserveState: true });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <meta name="csrf-token" content={window.csrfToken} />
    
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar>
                    {menuItems.map((item, index) => (
                        <Sidebar.Item
                            key={index}
                            href={item.href}
                            icon={item.icon}
                            text={item.text}
                            active={item.active}
                            method={item.method}
                            as={item.as}
                        />
                    ))}
                </Sidebar>
    
                <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <nav className="border-b border-gray-100 bg-white dark:bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between">
                                {/* Logo */}
                                <div className="flex">
                                    <div className="flex shrink-0 items-center">
                                        <Link 
                                            href="/dashboard" 
                                            className="flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <BoxIcon className="h-10 w-10 text-black dark:text-white" />
                                            <div className="flex flex-col">
                                                <span className="text-xl font-fira font-bold text-gray-800 dark:text-gray-200 tracking-tight">
                                                    UPP Store
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
    
                                {/* Right side: Theme switcher + Cart */}
                                <div className="hidden sm:ms-6 sm:flex sm:items-center gap-4">
                                    <ThemeSwitcher />
                                    <Link
                                        href={route("account")}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
                                    </Link>
                                    <div className="relative">
                                        <Link 
                                            href={route('cart.index')}
                                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
                                            {cart.length > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
                                                    {cart.length}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </div>
    
                                {/* Mobile menu button */}
                                <div className="-me-2 flex items-center sm:hidden">
                                    <button
                                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 focus:outline-none"
                                        aria-label="Toggle navigation menu"
                                        aria-expanded={showingNavigationDropdown}
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
    
                        {/* Mobile nav dropdown */}
                        <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                            <div className="space-y-1 pb-3 pt-2">
                                {menuItems.map((item, index) =>
                                    item.method ? (
                                        <ResponsiveNavLink
                                            key={index}
                                            href={item.href}
                                            method={item.method}
                                            as={item.as}
                                        >
                                            {item.text}
                                        </ResponsiveNavLink>
                                    ) : (
                                        <ResponsiveNavLink
                                            key={index}
                                            href={item.href}
                                            active={item.active}
                                        >
                                            {item.text}
                                        </ResponsiveNavLink>
                                    )
                                )}
    
                                <ResponsiveNavLink
                                    href={route('cart.index')}
                                    active={route().current('cart.index')}
                                >
                                    Carrito {cart.length > 0 && `(${cart.length})`}
                                </ResponsiveNavLink>
    
                                <ResponsiveNavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </ResponsiveNavLink>
    
                                <ResponsiveNavLink
                                    href={route("account")}
                                    active={route().current("account")}
                                >
                                    Mi cuenta
                                </ResponsiveNavLink>
                            </div>
    
                            {/* User info */}
                            <div className="border-t border-gray-200 pb-1 pt-4">
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
    
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route("profile.edit")}>
                                        Perfil
                                    </ResponsiveNavLink>
    
                                    {userCanAccessAdminPanel && (
                                        <ResponsiveNavLink href={route("admin.panel")}>
                                            Admin
                                        </ResponsiveNavLink>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
    
                    {/* Header opcional */}
                    {header && (
                        <header className="bg-white dark:bg-gray-800 shadow">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
    
                    {/* Main */}
                    <main className={mainContentClasses}>
                        <div className="max-w-full mx-auto">
                            {/* Navbar de carrito, checkout, etc. */}
                            {showCartNavbar && (
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Navbar 
                                        activeLink={activeLink}
                                        isConfirmVisible={isConfirmVisible}
                                        setIsConfirmVisible={setIsConfirmVisible}
                                        isCheckoutConfirmVisible={isCheckoutConfirmVisible}
                                        setIsCheckoutConfirmVisible={setIsCheckoutConfirmVisible}
                                        isCartEmpty={cart.length === 0}
                                    />
                                </Suspense>
                            )}
    
                            {/* Children */}
                            <div className={childrenWrapperClasses}>
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
    
            {/* Footer */}
            <div className="ml-16">
                {user && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <Footer />
                    </Suspense>
                )}
            </div>
    
            <Toaster />
        </div>
    );
}