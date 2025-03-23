import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { SidebarContext } from "./Sidebar";

export const AccordionContext = createContext()

export default function Accordion({ children, value, onChange, ...props }) {
    const [selected, setSelected] = useState(value)
    useEffect(() => {
        onChange?.(selected)
    }, [selected])
    return (
        <ul {...props}>
            <AccordionContext.Provider value={{ selected, setSelected }}>
                {children}
            </AccordionContext.Provider>
        </ul>
    );
}

export function AccordionItem({ children, value, trigger, ...props }) {
    const { selected, setSelected } = useContext(AccordionContext)
    const { expanded } = useContext(SidebarContext);
    const open = selected === value
    const ref = useRef(null)
    return (
        <li className="border-b" {...props}>
            <header
                role="button"
                onClick={() => setSelected(open ? null : value)}
                className="flex justify-between items-center p-4 font-medium"
            >
                {trigger}
                {expanded && ( // Solo mostrar la flecha si el Sidebar está expandido
                    <ChevronDownIcon
                        className={`h-5 w-5 text-gray-600 transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                )}
            </header>
            {expanded && ( // Solo mostrar el contenido si el Sidebar está expandido
                <div
                    className="overflow-y-hidden transition-all"
                    style={{
                        height: open ? ref.current?.offsetHeight || 0 : 0,
                    }}
                >
                    <div className="pt-2 pb-4" ref={ref}>
                        {children}
                    </div>
                </div>
            )}
        </li>
    );
}