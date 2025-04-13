import { Link } from "@inertiajs/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Breadcrumb({ currentPage }) {
    return (
        <nav className="flex items-center text-sm text-gray-600 mb-4">
            <Link
                href={route("account")}
                className="hover:text-blue-600 hover:underline"
            >
                Mi cuenta
            </Link>
            <ChevronRightIcon className="w-3 h-3 mx-2 text-gray-400" />
            <Link
                href={route("address.index")}
                className="hover:text-blue-600 hover:underline"
            >
                Direcciones
            </Link>
            {currentPage && (
                <>
                    <ChevronRightIcon className="w-3 h-3 mx-2 text-gray-400" />
                    <span className="text-gray-800 font-medium">
                        {currentPage}
                    </span>
                </>
            )}
        </nav>
    );
}
