import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Perfil
                </h2>
            }
        >
            <Head title="Perfil" />

            <div className="py-12 transition-colors duration-300">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Sección de Información del Perfil */}
                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8 transition-all duration-300 transform hover:shadow-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Sección de Actualización de Contraseña */}
                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8 transition-all duration-300 transform hover:shadow-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Sección de Eliminación de Cuenta */}
                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8 transition-all duration-300 transform hover:shadow-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
