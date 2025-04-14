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
    const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

    const handleCodSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simular el proceso de la compra
        setTimeout(async () => {
            try {
                await router.post(route('checkout.cod'), {
                    cart: cart.map(product => ({
                        id: product.id,
                        quantity: product.pivot.quantity
                    })),
                    total: cart.reduce((sum, product) => 
                        sum + (product.price * product.pivot.quantity), 0)
                });
                setIsCheckoutComplete(true);  // Completar la compra
            } catch (error) {
                console.error('COD error:', error);
                setIsProcessing(false);
            }
        }, 2000); // Simula un tiempo de procesamiento
    };

    return (
        <div className="py-12 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-700 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Resumen de tu pedido</h3>
                        
                        <OrderSummary cart={cart} />

                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Método de pago</h3>
                            
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

                            {selectedMethod === 'cod' && !isCheckoutComplete && (
                                <CODButton 
                                    isProcessing={isProcessing}
                                    onSubmit={handleCodSubmit}
                                />
                            )}

                            {isCheckoutComplete && (
                                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                                    <p className="font-semibold">¡Compra completada con éxito!</p>
                                    <p>Gracias por tu compra, te notificaremos cuando tu pedido esté listo para ser enviado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
