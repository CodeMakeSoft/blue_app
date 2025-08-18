import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToast } from "@/hooks/use-toast";
import {
    faCalendarAlt,
    faCreditCard,
    faDollarSign,
    faBoxOpen,
    faShoppingBag,
    faReceipt,
    faCheckCircle,
    faHourglassHalf,
    faTimesCircle,
    faEye,
    faFileInvoice
} from '@fortawesome/free-solid-svg-icons';
import Confirm from '@/Components/Confirm';
import Breadcrumb from '@/Components/Breadcrumb';

export default function Index({ orders }) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const { toast } = useToast();

    const handleCancelOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelConfirm(true);
    };

    const confirmCancelOrder = () => {
        router.post(
            route('orders.cancel', selectedOrderId),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast({
                        title: "Orden cancelada",
                        description: "La orden ha sido cancelada correctamente.",
                    });
                    setShowCancelConfirm(false);
                },
                onError: () => {
                    toast({
                        title: "Error al cancelar",
                        description: "No se pudo cancelar la orden. Intenta de nuevo.",
                        variant: "destructive",
                    });
                    setShowCancelConfirm(false);
                },
            }
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-green-500" />;
            case 'pending':
                return <FontAwesomeIcon icon={faHourglassHalf} className="mr-1 text-yellow-500" />;
            case 'cancelled':
                return <FontAwesomeIcon icon={faTimesCircle} className="mr-1 text-red-500" />;
            default:
                return <FontAwesomeIcon icon={faBoxOpen} className="mr-1 text-gray-400" />;
        }
    };

    const content = !Array.isArray(orders) || orders.length === 0 ? (
        <div className="space-y-4 text-center text-gray-600 dark:text-gray-300">
            <p className="text-lg">No tienes compras registradas.</p>
            <a
                href={route('dashboard')}
                className="inline-block px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                Ir a comprar
            </a>
        </div>
    ) : (
        <div className="max-w-5xl p-6 mx-auto">
            <div className="space-y-6">
                {orders.map(order => (
                    <div
                        key={order.id}
                        className="p-6 bg-white border border-gray-200 shadow-md dark:bg-gray-800 rounded-xl dark:border-gray-700"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                    <FontAwesomeIcon icon={faShoppingBag} className="mr-2 text-blue-500" />
                                    Orden #{order.id}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="space-y-1 text-right">
                                <span className="inline-flex items-center px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                    <FontAwesomeIcon icon={faCreditCard} className="mr-1" />
                                    {order.payment_method.toUpperCase()}
                                </span>
                                <br />
                                <span className={`inline-flex items-center text-sm px-2 py-1 rounded-full ${
                                    order.status === 'completed'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        : order.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                        : order.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                }`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </span>
                                <p className="font-semibold text-gray-800 text-md dark:text-white">
                                    <FontAwesomeIcon icon={faDollarSign} className="mr-1 text-green-500" />
                                    {parseFloat(order.total).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <ul className="pl-4 mt-4 text-gray-700 list-disc dark:text-gray-200">
                            {order.products.map(product => (
                                <li key={product.id}>
                                    {product.name} × {product.pivot.quantity} = ${(
                                        product.pivot.price * product.pivot.quantity
                                    ).toFixed(2)}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:gap-4">
                            <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                                Ver Detalles
                            </button>

                            <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:underline">
                                <FontAwesomeIcon icon={faFileInvoice} className="mr-1" />
                                Descargar Factura
                            </button>

                            {/* Botón de Devolución */}
                            <a
                                href={route('return.form', { order: order.id })}
                                className="flex items-center text-sm text-orange-600 dark:text-orange-400 hover:underline"
                            >
                                <FontAwesomeIcon icon={faBoxOpen} className="mr-1" />
                                Devolver Producto
                            </a>

                            {order.status === 'pending' && (
                                <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="flex items-center text-sm text-red-600 dark:text-red-400 hover:underline"
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                                    Cancelar Orden
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Breadcrumb
                        routes={[
                            { name: "Inicio", link: route("dashboard") },
                            { name: "Finalizar Compra", link: route("checkout.index") },
                        ]}
                        currentPage="Mis Compras"
                    />
                    <h2 className="flex items-center gap-2 mt-2 text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        <FontAwesomeIcon icon={faReceipt} className="text-blue-600 dark:text-blue-500" />
                        Mis Compras
                    </h2>
                </div>
            }
        >
            <Head title="Mis Compras" />
            {content}
            {showCancelConfirm && (
                <Confirm
                    title="Cancelar Orden"
                    message="¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer."
                    onConfirm={confirmCancelOrder}
                    onCancel={() => setShowCancelConfirm(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
