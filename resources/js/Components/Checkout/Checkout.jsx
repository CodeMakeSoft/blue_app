import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import PaymentMethodSelector from './PaymentMethodSelector';
import OrderSummary from './OrderSummary';
import PayPalButton from './PayPalButton';
import CODButton from './CODButton';

const Checkout = ({ cart = [], paymentMethods, paypalClientId }) => {
    const [selectedMethod, setSelectedMethod] = useState('paypal');
    const [paypalReady, setPaypalReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCodSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        try {
            await router.post(route('checkout.cod'), {
                cart: cart.map(product => ({
                    id: product.id,
                    quantity: product.pivot.quantity
                })),
                total: cart.reduce((sum, product) => 
                    sum + (product.price * product.pivot.quantity), 0)
            });
        } catch (error) {
            console.error('COD error:', error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h3 className="text-lg font-medium mb-4">Resumen de tu pedido</h3>
                        
                        <OrderSummary cart={cart} />
                        
                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">Método de pago</h3>
                            
                            <PaymentMethodSelector 
                                paymentMethods={paymentMethods}
                                selectedMethod={selectedMethod}
                                onMethodChange={setSelectedMethod}
                            />

                            {selectedMethod === 'paypal' && (
                                <PayPalButton 
                                    paypalClientId={paypalClientId}
                                    cart={cart}
                                    isReady={paypalReady}
                                    onReadyChange={setPaypalReady}
                                />
                            )}

                            {selectedMethod === 'cod' && (
                                <CODButton 
                                    isProcessing={isProcessing}
                                    onSubmit={handleCodSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;