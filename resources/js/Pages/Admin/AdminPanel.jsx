// resources/js/Pages/Admin/AdminPanel.jsx
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function AdminPanel({ activeRoute }) {
    return (
        <AdminLayout activeRoute={activeRoute}>
            <Head title="AdminPanel" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Bienvenido al Panel de Administración
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Gestiona usuarios, roles, permisos y más.
                </p>
            </div>
        </AdminLayout>
    );
}
