import React, { createContext, useContext, useState } from "react";
import { usePage } from "@inertiajs/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";

export const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const user = usePage().props.auth.user;
    const [expanded, setExpanded] = useState(false); // Cambiado a false para iniciar cerrado

    // Función para alternar el estado
    const toggleSidebar = () => {
        setExpanded((curr) => !curr);
    };

    // Función para cerrar el sidebar
    const closeSidebar = () => {
        setExpanded(false);
    };

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img
                        src="https://img.logoipsum.com/280.svg"
                        className={`overflow-hidden transition-all ${
                            expanded ? "w-20 h-10" : "w-0 h-0"
                        }`}
                        alt="Logo"
                    />
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? (
                            <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-600" />
                        ) : (
                            <ChevronDoubleRightIcon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded, closeSidebar }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="border-t flex p-3">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.name.substring(
                            0,
                            2
                        )}&background=c7d2fe&color=3730a3&bold=true`}
                        alt="Usuario"
                        className="w-10 h-10 rounded-md"
                    />
                    <div
                        className={`overflow-hidden transition-all ${
                            expanded ? "w-52 ml-3" : "w-0"
                        } flex items-center justify-between`} // Agrega flex, items-center y justify-between
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">{user.name}</h4>
                            <span className="text-xs text-gray-600">
                                {user.email}
                            </span>
                        </div>
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                    </div>
                </div>
            </nav>
        </aside>
    );
}

export function SidebarItem({ icon, text, active, alert, children }) {
    const { expanded, closeSidebar } = useContext(SidebarContext);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        if (children) {
            // Si tiene hijos, solo alterna la expansión
            setIsExpanded(!isExpanded);
        } else {
            // Si no tiene hijos, cierra el sidebar
            closeSidebar();
        }
    };

    return (
        <li
            className={`
                relative flex flex-col items-start py-2 px-3 my-1
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${
                    active
                        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                        : "hover:bg-indigo-50 text-gray-600"
                }
            `}
        >
            <div className="w-full flex items-center" onClick={handleClick}>
                {icon}
                <span
                    className={`overflow-hidden transition-all ${
                        expanded ? "w-52 ml-3" : "w-0"
                    }`}
                >
                    {text}
                </span>
                {children && expanded && (
                    <ChevronDownIcon
                        className={`h-5 w-5 text-gray-600 ml-auto transition-transform ${
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
            </div>
            {children && expanded && isExpanded && (
                <div className="w-full pl-6">{children}</div>
            )}
            {!expanded && (
                <div
                    className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-indigo-100 text-indigo-800 text-sm
                        invisible opacity-20 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
                >
                    {text}
                </div>
            )}
        </li>
    );
}
