import React from 'react';
import { Link } from '@inertiajs/react';
import Confirm from '@/Components/Cart/Confirm'; // Importamos el componente Confirm

export default function Navbar({ activeLink, isConfirmVisible, setIsConfirmVisible }) {
    // Función para manejar la confirmación
    const handleConfirm = () => {
        // Aquí puedes agregar lógica para proceder con el pago (por ejemplo, redirigir al usuario)
        console.log('Compra confirmada');
        setIsConfirmVisible(false); // Ocultar la ventana modal después de confirmar
    };

    // Función para manejar la cancelación
    const handleCancel = () => {
        console.log('Compra cancelada');
        setIsConfirmVisible(false); // Ocultar la ventana modal después de cancelar
    };

    return (
        <nav className="py-4 px-6 text-sm font-medium bg-slate-100">
            <ul className="flex space-x-3">
                <li>
                    <Link
                        href={route('cart.index')}
                        className={`block px-3 py-2 rounded-md ${
                            activeLink === 'cart.index' ? 'bg-sky-500 text-white' : 'text-black'
                        } hover:bg-sky-500 hover:text-white`}
                    >
                        Seguir Comprando
                    </Link>
                </li>
                <li>
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault(); // Evitar que la página se recargue
                            setIsConfirmVisible(true); // Mostrar la ventana modal
                        }}
                        className={`block px-3 py-2 rounded-md ${
                            activeLink === 'cart.confirm' ? 'bg-sky-500 text-white' : 'text-black'
                        } hover:bg-sky-500 hover:text-white`}
                    >
                        Proceder al Pago
                    </Link>
                </li>
            </ul>

            {/* Renderizar la ventana modal si isConfirmVisible es true */}
            {isConfirmVisible && (
                <Confirm
                    title="Confirmación de Compra"
                    message="¿Estás seguro de realizar esta compra?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </nav>
    );
}