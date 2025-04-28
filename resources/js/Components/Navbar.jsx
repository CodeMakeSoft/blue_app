import React from 'react';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Confirm from '@/Components/Confirm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, 
    faArrowLeft, 
    faCreditCard, 
    faSignOutAlt,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

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

    // Updated active class to be visible in both light and dark modes
    const getActiveClass = (routeName) => {
        return activeLink === routeName 
            ? 'bg-blue-500 text-white font-semibold rounded-lg border-b-2 border-blue-700 shadow-md'
            : '';
    };

    // Updated with consistent hover color
    const sharedClasses = "navbar-link flex items-center text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition duration-200 px-3 py-2 rounded-lg";

    // Consistent button styling
    const buttonClasses = "navbar-button flex items-center px-4 py-2 rounded-lg transition duration-200";
    const activeButtonClasses = "bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-600";
    const disabledButtonClasses = "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-600 dark:text-gray-300";

    return (
        <nav className="navbar bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-4 shadow-md rounded-md">
            <ul className="navbar-list flex justify-between space-x-6">
                <li className="navbar-item">
                    <Link
                        href={route('dashboard')}
                        className={`${sharedClasses} ${getActiveClass('dashboard')}`}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Seguir Comprando
                    </Link>
                </li>
                <li className="navbar-item">
                {activeLink === 'checkout.index' ? (
                    <button
                        onClick={() => setIsCheckoutConfirmVisible(true)}
                        className={`${sharedClasses} ${getActiveClass('cart.index')}`}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                        Volver al Carrito
                    </button>
                ) : (
                    <Link
                        href={route('cart.index')}
                        className={`${sharedClasses} ${getActiveClass('cart.index')}`}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
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
                        className={`${sharedClasses} ${getActiveClass('checkout.index')} ${buttonClasses} ${isCartEmpty ? disabledButtonClasses : activeButtonClasses}`}
                        disabled={isCartEmpty}
                        >
                        <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                        Proceder al Pago
                        </button>
                    ) : (
                        <button
                        onClick={() => {
                            if (!isCartEmpty) {
                            router.visit(route('checkout.index'));
                            }
                        }}
                        className={`${sharedClasses} ${getActiveClass('checkout.index')} ${buttonClasses} ${isCartEmpty ? disabledButtonClasses : activeButtonClasses}`}
                        disabled={isCartEmpty}
                        >
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Finalizar Compra
                        </button>
                    )}
                </li>
                <li className="navbar-item">
                    <Link
                        href={route('purchases.index')}
                        className={`${sharedClasses} ${getActiveClass('purchases.index')}`}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Mis Compras
                    </Link>
                </li>
            </ul>

            {/* Checkout Confirmation Modal */}
            {isConfirmVisible && (
                <div className="modal-overlay fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="modal-content bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-6 rounded-lg shadow-lg w-80">
                        <Confirm
                            title={
                                <>
                                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                                    Confirmación de Compra
                                </>
                            }
                            message="¿Deseas proceder al pago?"
                            onConfirm={handleConfirmCheckout}
                            onCancel={() => setIsConfirmVisible(false)}
                        />
                    </div>
                </div>
            )}

            {/* Abandon Checkout Confirmation Modal */}
            {isCheckoutConfirmVisible && (
                <div className="modal-overlay fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="modal-content bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-6 rounded-lg shadow-lg w-80">
                        <Confirm
                            title={
                                <>
                                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                    Abandonar Compra
                                </>
                            }
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