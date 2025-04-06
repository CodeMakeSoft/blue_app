import React from 'react';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Confirm from '@/Components/Cart/Confirm';

export default function Navbar({ 
    activeLink, 
    isConfirmVisible, 
    setIsConfirmVisible,
    isCheckoutConfirmVisible,
    setIsCheckoutConfirmVisible,
    isCartEmpty 
}) {
    const handleConfirmCheckout = () => {
        if (!isCartEmpty) {
            router.visit(route('checkout.index'));
        }
        setIsConfirmVisible(false);
    };

    const handleAbandonCheckout = () => {
        router.visit(route('cart.index'));
        setIsCheckoutConfirmVisible(false);
    };

    const getActiveClass = (link) => activeLink === link ? 'active' : '';

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link
                        href={route('dashboard')}
                        className="navbar-link"
                    >
                        Seguir Comprando
                    </Link>
                </li>
                <li className="navbar-item">
                    {activeLink === 'checkout.index' ? (
                        <button
                            onClick={() => setIsCheckoutConfirmVisible(true)}
                            className="navbar-button"
                        >
                            Volver al Carrito
                        </button>
                    ) : (
                        <Link
                            href={route('cart.index')}
                            className={`navbar-link ${getActiveClass('cart.index')}`}
                        >
                            Carrito
                        </Link>
                    )}
                </li>
                <li className="navbar-item">
                    {activeLink === 'cart.index' ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                isCartEmpty ? setIsConfirmVisible(false) : setIsConfirmVisible(true);
                            }}
                            className={`navbar-button ${isCartEmpty ? 'disabled' : ''}`}
                            disabled={isCartEmpty}
                        >
                            Proceder al Pago
                        </button>
                    ) : (
                        <Link
                            href={route('checkout.index')}
                            className={`navbar-link ${getActiveClass('checkout.index')}`}
                        >
                            Finalizar Compra
                        </Link>
                    )}
                </li>
            </ul>

            {/* Checkout Confirmation Modal */}
            {isConfirmVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <Confirm
                            title="Confirmación de Compra"
                            message="¿Deseas proceder al pago?"
                            onConfirm={handleConfirmCheckout}
                            onCancel={() => setIsConfirmVisible(false)}
                        />
                    </div>
                </div>
            )}

            {/* Abandon Checkout Confirmation Modal */}
            {isCheckoutConfirmVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <Confirm
                            title="Abandonar Compra"
                            message="¿Estás seguro que deseas volver al carrito? Los datos ingresados no se guardarán."
                            onConfirm={handleAbandonCheckout}
                            onCancel={() => setIsCheckoutConfirmVisible(false)}
                            confirmText="Sí, abandonar"
                            cancelText="Continuar compra"
                        />
                    </div>
                </div>
            )}
        </nav>
    );
}