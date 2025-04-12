import { useEffect } from 'react';
import { loadScript } from '@paypal/paypal-js';

const PayPalButton = ({ paypalClientId, cart, isReady, onReadyChange }) => {
    useEffect(() => {
        let paypalButtons;
        
        const initializePaypal = async () => {
            try {
                await loadScript({ 
                    'client-id': paypalClientId,
                    currency: 'MXN',
                    'disable-funding': 'credit,card'
                });
                
                paypalButtons = window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return fetch(route('checkout.createOrder'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                            },
                            body: JSON.stringify({
                                total: cart.reduce((sum, product) => 
                                    sum + (product.price * product.pivot.quantity), 0
                                )
                            })
                        })
                        .then(res => res.json())
                        .then(order => order.id);
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            router.visit(route('checkout.success'));
                        });
                    },
                    onError: (err) => {
                        console.error('PayPal error:', err);
                        alert('Ocurrió un error con PayPal. Intenta de nuevo.');
                    }
                });
                
                paypalButtons.render('#paypal-button-container');
                onReadyChange(true);
            } catch (error) {
                console.error('Failed to load PayPal JS:', error);
            }
        };

        initializePaypal();

        return () => {
            if (paypalButtons) {
                paypalButtons.close();
            }
        };
    }, [paypalClientId, cart, onReadyChange]);

    return (
        <>
            <div id="paypal-button-container" className={`${!isReady ? 'invisible' : ''} dark:text-white dark:bg-gray-800 dark:border-gray-700`}></div>
            {!isReady && (
                <div className="text-center py-4 dark:text-gray-300">
                    <p>Cargando PayPal...</p>
                </div>
            )}
        </>
    );
};

export default PayPalButton;
