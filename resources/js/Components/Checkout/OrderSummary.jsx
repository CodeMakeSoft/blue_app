import React from 'react';
import PropTypes from 'prop-types';

export default function OrderSummary({ 
    cart, 
    total = {
        subtotal: 0,
        shipping: 0,
        taxes: 0,
        total: 0
    }
}) {
    // Ensure safe access to total values
    const safeTotal = {
        subtotal: total?.subtotal ?? 0,
        shipping: total?.shipping ?? 0,
        taxes: total?.taxes ?? 0,
        total: total?.total ?? 0
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${safeTotal.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold">${safeTotal.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-semibold">${safeTotal.taxes.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${safeTotal.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

OrderSummary.propTypes = {
    cart: PropTypes.array.isRequired,
    total: PropTypes.shape({
        subtotal: PropTypes.number,
        shipping: PropTypes.number,
        taxes: PropTypes.number,
        total: PropTypes.number
    })
};