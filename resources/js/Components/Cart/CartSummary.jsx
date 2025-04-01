import React from 'react';
import { calculateCartTotals } from '@/Utils/CartUtils';

export default function CartSummary({ products = [] }) {
    const totals = calculateCartTotals(products);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-6">
            <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
                <span>Envío</span>
                <span>${totals.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
            </div>
        </div>
    );
}   