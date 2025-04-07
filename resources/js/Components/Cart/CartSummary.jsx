import React from 'react';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCreditCard, faReceipt, faTruck } from "@fortawesome/free-solid-svg-icons";

const CartSummary = ({ totals, isCartEmpty, onCheckout }) => {
    return (
        <div className="mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faReceipt} className="mr-2 text-gray-600" />
            Resumen del pedido
        </h3>
        
        <div className="space-y-3 mb-5">
            <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faTruck} className="mr-1.5 w-3 h-3" />
                    Envío
                </span>
                <span className="font-medium">${totals.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${totals.total.toFixed(2)}</span>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
            <Link 
                href={route('dashboard')} 
                className="flex-1 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-center font-medium flex items-center justify-center"
            >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Seguir Comprando
            </Link>
            <button
                onClick={onCheckout}
                disabled={isCartEmpty}
                className={`flex-1 px-5 py-2.5 text-white rounded-lg text-center font-medium transition duration-200 flex items-center justify-center ${
                    isCartEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                }`}
            >
            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                Proceder al Pago
            </button>
        </div>
        </div>
    );
};

export default CartSummary;