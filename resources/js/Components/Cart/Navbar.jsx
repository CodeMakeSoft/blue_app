import React from 'react';
import { Link } from '@inertiajs/react';
import Confirm from '@/Components/Cart/Confirm'; // Importamos el componente Confirm
import { router } from '@inertiajs/react';

export default function Navbar({ activeLink, isConfirmVisible, setIsConfirmVisible, isCartEmpty }) {
    // Función para manejar la confirmación
    const handleConfirm = () => {
        if (!isCartEmpty) {
            // Redirigir al checkout usando Inertia
            router.visit(route('checkout.show'));
        }
        setIsConfirmVisible(false); // Ocultar la ventana modal después de confirmar
    };

    // Función para manejar la cancelación
    const handleCancel = () => {
        console.log('Compra cancelada');
        setIsConfirmVisible(false); // Ocultar la ventana modal después de cancelar
    };

    // Usamos la concatenación de cadenas para obtener las clases activas
    const getActiveClass = () => (activeLink === 'cart.index' ? 'border-b-4 border-blue-600' : '');
    const getConfirmClass = () => (activeLink === 'cart.confirm' ? 'bg-slate-200 text-black' : 'text-gray-700');

    return (
        <nav className="py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg rounded-lg">
            <ul className="flex space-x-6 justify-center">
                <li>
                    <Link
                        href={route('dashboard')}
                        aria-label="Regresar a la tienda"
                        role="link"
                        className={`block px-4 py-2 rounded-md text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-300 ${getActiveClass()}`}
                    >
                        Seguir Comprando
                    </Link>
                </li>
                <li>
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (isCartEmpty) {
                                setIsConfirmVisible(false);
                            } else {
                                setIsConfirmVisible(true);
                            }
                        }}
                        aria-label="Proceder al pago"
                        role="button"
                        className={`block px-4 py-2 rounded-md ${getConfirmClass()} hover:bg-blue-500 hover:text-white transition-colors duration-300 ${isCartEmpty ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        disabled={isCartEmpty}
                    >
                        Proceder al Pago
                    </Link>
                </li>
            </ul>

            {/* Modal de Confirmación condicional */}
            {isConfirmVisible && (
                <Confirm
                    title={isCartEmpty ? "Atención" : "Confirmación de Compra"}
                    message={
                        isCartEmpty 
                            ? "No puedes proceder al pago porque el carrito está vacío."
                            : "Al confirmar, serás redirigido al proceso de pago. ¿Deseas continuar?"
                    }
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </nav>
    );
}
