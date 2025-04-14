import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Breadcrumb"; // Asegúrate de que este componente esté correctamente importado

export default function Cancel({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user} header={
            <>
                <Breadcrumb
                    routes={[
                        { name: "Inicio", link: route("dashboard") },
                    ]}
                    currentPage="Pedido Cancelado"
                />
                <h1 className="text-2xl font-semibold text-gray-800 mt-2">
                    Pedido Cancelado
                </h1>
            </>
        }>
            <Head title="Pedido Cancelado" />

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold text-red-500">Pedido cancelado</h1>
                <p className="mt-2">Tu pedido no se pudo completar. Intenta nuevamente.</p>
            </div>
        </AuthenticatedLayout>
    );
}
