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

    return (
        <nav className="py-4 px-6 text-sm font-medium bg-slate-100">
            <ul className="flex space-x-3">
                <li>
                    <Link
                        href={route('dashboard')}
                        className={`block px-3 py-2 rounded-md ${
                            activeLink === 'cart.index' ? 'bg-slate-300 text-black' : 'text-black'
                        } hover:bg-[#1F2937] hover:text-white`}
                    >
                        Seguir Comprando
                    </Link>
                </li>
                <li>
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault(); // Evitar que la página se recargue
                            if (isCartEmpty) {
                                // Mostrar mensaje de error si el carrito está vacío
                                alert('El carrito está vacío');
                                return;
                            }
                            setIsConfirmVisible(true); // Mostrar la ventana modal
                        }}
                        className={`block px-3 py-2 rounded-md ${
                            activeLink === 'cart.confirm' ? 'bg-slate-300 text-black' : 'text-black'
                        } hover:bg-[#1F2937] hover:text-white ${
                            isCartEmpty ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Proceder al Pago
                    </Link>
                </li>
            </ul>

            {/* Modal de Confirmación condicional */}
            {isConfirmVisible && (
                <Confirm
                    title={isCartEmpty ? "Carrito Vacío" : "Confirmación de Compra"}
                    message={
                        isCartEmpty 
                            ? "Debes agregar productos al carrito antes de proceder al pago."
                            : "¿Estás seguro de realizar esta compra?"
                    }
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </nav>
    );
}