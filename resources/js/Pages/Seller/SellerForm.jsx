import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function SellerForm({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email,
        birth_day: "",
        birth_month: "",
        birth_year: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("seller.store"), {
            preserveScroll: true,
            onSuccess: () => {},
        });
    };

    // Generar opciones para días, meses y años
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        { value: 1, name: "Enero" },
        { value: 2, name: "Febrero" },
        { value: 3, name: "Marzo" },
        { value: 4, name: "Abril" },
        { value: 5, name: "Mayo" },
        { value: 6, name: "Junio" },
        { value: 7, name: "Julio" },
        { value: 8, name: "Agosto" },
        { value: 9, name: "Septiembre" },
        { value: 10, name: "Octubre" },
        { value: 11, name: "Noviembre" },
        { value: 12, name: "Diciembre" },
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const calculateAge = () => {
        if (data.birth_day && data.birth_month && data.birth_year) {
            const birthDate = new Date(
                data.birth_year,
                data.birth_month - 1,
                data.birth_day
            );
            const ageDiff = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDiff);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        return 0;
    };

    const age = calculateAge();
    const isOver16 = age >= 16;

    return (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Head title="Convertirse en Vendedor" />

            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                Vuélvete Vendedor
            </h1>

            <form onSubmit={submit}>
                <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                        {errors.first_name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Apellido
                        </label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                        {errors.last_name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.last_name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-600 dark:border-gray-600"
                        />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha de Nacimiento
                        </label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {/* Día */}
                            <select
                                value={data.birth_day}
                                onChange={(e) =>
                                    setData("birth_day", e.target.value)
                                }
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                required
                            >
                                <option value="">Día</option>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>

                            {/* Mes */}
                            <select
                                value={data.birth_month}
                                onChange={(e) =>
                                    setData("birth_month", e.target.value)
                                }
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                required
                            >
                                <option value="">Mes</option>
                                {months.map((month) => (
                                    <option
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.name}
                                    </option>
                                ))}
                            </select>

                            {/* Año */}
                            <select
                                value={data.birth_year}
                                onChange={(e) =>
                                    setData("birth_year", e.target.value)
                                }
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                required
                            >
                                <option value="">Año</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.birth_day && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.birth_day}
                            </p>
                        )}
                    </div>

                    {/* Verificación de edad */}
                    {age > 0 && (
                        <div
                            className={`p-3 rounded-md ${
                                isOver16
                                    ? "bg-green-100 dark:bg-green-900"
                                    : "bg-red-100 dark:bg-red-900"
                            }`}
                        >
                            <p
                                className={`text-center ${
                                    isOver16
                                        ? "text-green-800 dark:text-green-200"
                                        : "text-red-800 dark:text-red-200"
                                }`}
                            >
                                {isOver16
                                    ? `Tienes ${age} años. ¡Cumples con el requisito de edad!`
                                    : `Tienes ${age} años. Debes tener al menos 16 años para ser vendedor.`}
                            </p>
                        </div>
                    )}

                    {/* Botón de envío */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Link
                            href={route("dashboard")}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={!isOver16 || processing}
                            className={`px-4 py-2 rounded-md text-white ${
                                isOver16
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-blue-400 cursor-not-allowed"
                            } transition-colors`}
                        >
                            {processing ? "Procesando..." : "Enviar Solicitud"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
