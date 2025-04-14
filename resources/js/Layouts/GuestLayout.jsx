import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col items-center pt-6 sm:justify-center sm:pt-0 flex-1">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-gray-300" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800 dark:text-gray-100">
                    {children}
                </div>
            </div>

            {/* No incluir el Footer en el GuestLayout */}
        </div>
    );
}
