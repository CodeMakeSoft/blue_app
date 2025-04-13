import React, { createContext, useContext, useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
    Bars3BottomLeftIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/solid";

export const SidebarContext = createContext();

export function Sidebar({ children }) {
    const user = usePage().props.auth.user;
    const [expanded, setExpanded] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth < 768;
            setIsMobile(isNowMobile);

            if (!isNowMobile) {
                setMobileVisible(false); // ocultar el sidebar móvil si vuelve a desktop
            }
        };

        handleResize(); // correr al inicio
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMouseEnter = () => {
        if (!isMobile) setExpanded(true);
    };

    const handleMouseLeave = () => {
        if (!isMobile) setExpanded(false);
    };

    const toggleMobileSidebar = () => {
        setMobileVisible((prev) => !prev);
    };

    return (
        <>
            {/* Botón para móviles (esquina inferior izquierda) */}
            {isMobile && !mobileVisible && (
                <button
                    onClick={toggleMobileSidebar}
                    className="fixed z-40 bottom-4 left-4 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all"
                >
                    <Bars3BottomLeftIcon className="h-6 w-6" />
                </button>
            )}

            {(mobileVisible || !isMobile) && (
                <aside
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="fixed top-0 left-0 h-screen z-30"
                >
                    <nav className="h-full flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm relative transition-all duration-300">
                        <SidebarContext.Provider value={{ expanded: isMobile ? true : expanded }}>
                            {/* Header */}
                            <div className="p-4 pb-2">
                                {(expanded || isMobile) && (
                                    <div className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                                        Menú
                                    </div>
                                )}
                            </div>

                            {/* Menú principal */}
                            <div className="flex-1 px-3">
                                <ul>{children}</ul>
                            </div>

                            {/* Usuario */}
                            <div className="px-3 pb-4 relative">
                                <div
                                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.name.substring(0, 2)}&background=c7d2fe&color=3730a3&bold=true`}
                                        alt="Usuario"
                                        className="w-8 h-8 rounded-md"
                                    />
                                    {(expanded || isMobile) && (
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

                                {showProfileMenu && (expanded || isMobile) && (
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
            )}
        </>
    );
}

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
                relative flex items-center py-2 px-3 my-1
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
