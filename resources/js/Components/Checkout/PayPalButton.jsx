import { useEffect } from 'react';
import { loadScript } from '@paypal/paypal-js';
import { router } from '@inertiajs/react';

const PayPalButton = ({ paypalClientId, isReady, onReadyChange, cart }) => {
    useEffect(() => {
        let paypalButtons;

        const initializePaypal = async () => {
            try {
                await loadScript({
                    'client-id': paypalClientId,
                    currency: 'MXN',
                    'disable-funding': 'credit,card',
                });

                paypalButtons = window.paypal.Buttons({
                    createOrder: async () => {
                        const res = await fetch(route('checkout.paypal.create'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                            },
                        });

                        const data = await res.json();
                        return data.id;
                    },

                    onApprove: async (data) => {
                        const res = await fetch(route('checkout.paypal.capture'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                            },
                            body: JSON.stringify({
                                orderID: data.orderID,
                            }),
                        });

                        const result = await res.json();

                        if (result.success) {
                            router.visit(route('checkout.success'));
                        } else {
                            alert('Error al capturar el pago.');
                        }
                    },

                    onError: (err) => {
                        console.error('PayPal error:', err);
                        alert('Ocurrió un error con PayPal. Intenta de nuevo.');
                    }
                });

                paypalButtons.render('#paypal-button-container');
                onReadyChange(true);
            } catch (error) {
                console.error('Error inicializando PayPal:', error);
            }
        };

        initializePaypal();

        return () => {
            if (paypalButtons) paypalButtons.close();
        };
    }, [paypalClientId, onReadyChange]);

    return (
        <div className="flex justify-center w-full"> {/* Aquí centramos el contenedor */}
            <div id="paypal-button-container" className={`${!isReady ? 'invisible' : ''} dark:text-white dark:bg-gray-800 dark:border-gray-700`}></div>
            {!isReady && (
                <div className="text-center py-4 dark:text-gray-300">
                    <p>Cargando PayPal...</p>
                </div>
            )}
        </div>
    );
};

export default PayPalButton;
