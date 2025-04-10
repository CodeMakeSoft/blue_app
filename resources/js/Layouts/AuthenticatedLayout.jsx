import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import Navbar from '@/Components/Navbar'; // Tu componente Navbar personalizado

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isCheckoutConfirmVisible, setIsCheckoutConfirmVisible] = useState(false);
    
    // Detecta si estamos en rutas de carrito o checkout
    const { url } = usePage();
    const showCartNavbar = url.startsWith('/cart') || url.startsWith('/checkout');
    const cart = usePage().props.cart || [];
    const activeLink = route().current('checkout.index') ? 'checkout.index' : 'cart.index';
    const { auth } = usePage().props;
   
    //const user = auth.user;
    const userCanAccessAdminPanel = auth.permissions.includes(
        "can-access-admin-panel"
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <meta name="csrf-token" content={window.csrfToken} />
            
            {/* Navbar Principal (siempre visible) */}
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo y navegación izquierda */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route("brand.catalog")}
                                    active={route().current("brand.catalog")}
                                >
                                    Marcas
                                </NavLink>
                                <NavLink
                                    href={route("category.catalog")}
                                    active={route().current("category.catalog")}
                                >
                                    Categorias
                                </NavLink>
                            </div>
                        </div>

                        {/* Parte derecha - Usuario y carrito */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>

                                        {userCanAccessAdminPanel && (
                                            <Dropdown.Link
                                                href={route("admin.panel")}
                                            >
                                                Admin
                                            </Dropdown.Link>
                                        )}

                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                            <div className="flex shrink-0 items-center ml-4">
                                <Link href={route('cart.index')}>
                                    <ShoppingCartIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                                    {cart.length > 0 && (
                                        <span className="absolute -mt-2 ml-3 rounded-full bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Menú móvil */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
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

                {/* Contenido del menú móvil */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('cart.index')}
                            active={route().current('cart.index')}
                        >
                            Carrito
                        </ResponsiveNavLink>
                    </div>

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
                                Profile
                            </ResponsiveNavLink>

                            {userCanAccessAdminPanel && (
                                <ResponsiveNavLink href={route("admin.panel")}>
                                    Admin
                                </ResponsiveNavLink>
                            )}

                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenedor principal */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header opcional */}
                {header && (
                    <header className="bg-white shadow-sm rounded-lg mb-6 p-4">
                        {header}
                    </header>
                )}
                
                {/* Navbar de Carrito/Checkout (solo visible en esas rutas) */}
                {showCartNavbar && (
                    <Navbar 
                        activeLink={activeLink}
                        isConfirmVisible={isConfirmVisible}
                        setIsConfirmVisible={setIsConfirmVisible}
                        isCheckoutConfirmVisible={isCheckoutConfirmVisible}
                        setIsCheckoutConfirmVisible={setIsCheckoutConfirmVisible}
                        isCartEmpty={cart.length === 0}
                    />
                )}

                {/* Contenido principal */}
                <main className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}