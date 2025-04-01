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

    const getActiveClass = () => activeLink === 'cart.index' ? 'bg-slate-300' : '';
    const getConfirmClass = () => activeLink === 'cart.confirm' ? 'bg-slate-300 text-black' : 'text-black';

    return (
        <nav className="py-4 px-6 text-sm font-medium bg-slate-100">
            <ul className="flex space-x-3">
                <li>
                    <Link
                        href={route('dashboard')}
                        aria-label="Regresar a la tienda"
                        role="link"
                        className={`block px-3 py-2 rounded-md text-black hover:bg-[#1F2937] hover:text-white ${getActiveClass()}`}
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
                        className={`block px-3 py-2 rounded-md ${getConfirmClass()} hover:bg-[#1F2937] hover:text-white ${isCartEmpty ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
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