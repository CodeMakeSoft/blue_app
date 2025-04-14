import React from "react";
import { Link } from "@inertiajs/react";

export default function Breadcrumb({ routes = [], currentPage = "" }) {
    return (
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <ol className="list-reset flex flex-wrap items-center">
                {routes.map((route, index) => (
                    <li key={index} className="flex items-center">
                        <Link href={route.link} className="hover:underline">
                            {route.name}
                        </Link>
                        <span className="mx-2">/</span>
                    </li>
                ))}
                <li className="text-gray-700 dark:text-gray-300 font-medium">{currentPage}</li>
            </ol>
        </nav>
    );
}
