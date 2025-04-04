import React, { createContext, useContext, useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    Bars3BottomLeftIcon,
    XMarkIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/solid";

export const SidebarContext = createContext();

export function Sidebar({ children }) {
    const user = usePage().props.auth.user;
    const [expanded, setExpanded] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Detectar cambios en el tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) setExpanded(false);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setExpanded(!expanded);
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    

    return (
        <>
            {/* Botón flotante para móviles */}
            {isMobile && !expanded && (
                <button
                    onClick={toggleSidebar}
                    className="fixed z-40 bottom-4 left-4 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all"
                >
                    <Bars3BottomLeftIcon className="h-6 w-6" />
                </button>
            )}

            <aside
                className={`h-screen ${
                    isMobile && !expanded ? "hidden" : "block"
                }`}
            >
                <nav className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm relative">
                    <SidebarContext.Provider value={{ expanded }}>
                        {/* Header Section */}
                        <div className="p-4 pb-2 flex flex-col">
                            <div className="flex justify-between items-center">
                                {expanded && (
                                    <div className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                                        Menú
                                    </div>
                                )}
                                <button
                                    onClick={toggleSidebar}
                                    className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    {expanded ? (
                                        <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    ) : (
                                        <Bars3BottomLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Main Navigation */}
                        <div className="flex-1 px-3">
                            <ul>{children}</ul>
                        </div>

                        {/* User Footer */}
                        <div className="px-3 pb-4 relative">
                            <div
                                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={toggleProfileMenu}
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user.name.substring(
                                        0,
                                        2
                                    )}&background=c7d2fe&color=3730a3&bold=true`}
                                    alt="Usuario"
                                    className="w-8 h-8 rounded-md"
                                />
                                {expanded && (
                                    <div className="ml-3 overflow-hidden">
                                        <h4 className="text-sm font-medium truncate dark:text-white">
                                            {user.name}
                                        </h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user.email}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            {showProfileMenu && expanded && (
                                <div className="absolute bottom-16 left-3 right-3 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-10">
                                    <Link
                                        href={route("profile.edit")}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <UserCircleIcon className="h-5 w-5 mr-2" />
                                        Perfil
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                                        Cerrar sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </SidebarContext.Provider>
                </nav>
            </aside>
        </>
    );
}

// Componente Item del Sidebar con soporte para submenús
Sidebar.Item = function SidebarItem({ icon, text, href, active, alert, children }) {
    const { expanded } = useContext(SidebarContext);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = (e) => {
        if (children) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <li
            className={`
            relative flex flex-col items-start py-2 px-3 my-1
            font-medium rounded-md
            transition-colors group
            ${
                active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:from-indigo-900 dark:to-indigo-800 dark:text-indigo-100"
                    : "hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            }
        `}
        >
            <Link 
                href={href || "#"} 
                className="w-full flex items-center"
                onClick={handleClick}
            >
                <span className="flex-shrink-0">{icon}</span>
                <span
                    className={`overflow-hidden transition-all ${
                        expanded ? "w-52 ml-3" : "w-0"
                    }`}
                >
                    {text}
                </span>
                {children && expanded && (
                    <ChevronDownIcon
                        className={`h-5 w-5 text-gray-600 dark:text-gray-300 ml-auto transition-transform ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                )}
                {alert && (
                    <div
                        className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                            expanded ? "" : "top-2"
                        }`}
                    />
                )}
            </Link>

            {children && expanded && isExpanded && (
                <div className="w-full pl-6 dark:text-gray-300">
                    {React.Children.map(children, child => 
                        React.cloneElement(child, {
                            className: "w-full flex items-center text-left p-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md"
                        })
                    )}
                </div>
            )}

            {!expanded && (
                <div
                    className={`
                    absolute left-full rounded-md px-2 py-1 ml-6
                    bg-indigo-100 dark:bg-gray-700 text-indigo-800 dark:text-gray-200 text-sm
                    invisible opacity-20 -translate-x-3 transition-all
                    group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                `}
                >
                    {text}
                </div>
            )}
        </li>
    );
};