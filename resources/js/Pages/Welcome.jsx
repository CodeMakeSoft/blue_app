import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50 relative">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                    onError={handleImageError}
                />

                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white px-4">
                    <div className="relative w-full max-w-2xl lg:max-w-7xl">
                        {/* Header con logo */}
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <ApplicationLogo className="h-12 w-auto lg:h-16" />
                            </div>

                            {/* Login/Register links */}
                            <div className="flex justify-end space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-md text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-md text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="ml-4 text-md text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </header>

                        {/* Aquí puedes agregar más contenido si deseas */}

                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
