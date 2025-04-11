import { useState, useEffect } from "react";
import {
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
} from "@heroicons/react/24/solid";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "system";
        }
        return "system";
    });

    // Aplicar el tema al cargar y cuando cambie
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem("theme", theme);

        // Emitir evento personalizado
        window.dispatchEvent(
            new CustomEvent("themeChanged", {
                detail: { theme },
            })
        );
    }, [theme]);

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-full ${
                    theme === "light"
                        ? "bg-indigo-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-300"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
                title="Tema claro"
            >
                <SunIcon className="h-5 w-5" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-full ${
                    theme === "dark"
                        ? "bg-indigo-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-300"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
                title="Tema oscuro"
            >
                <MoonIcon className="h-5 w-5" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-full ${
                    theme === "system"
                        ? "bg-indigo-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-300"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
                title="Tema del sistema"
            >
                <ComputerDesktopIcon className="h-5 w-5" />
            </button>
        </div>
    );
}
