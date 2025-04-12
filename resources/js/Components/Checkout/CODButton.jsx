import React from 'react';

const CODButton = ({ isProcessing, onSubmit }) => {
    return (
        <form onSubmit={onSubmit} className="w-full">
            <button
                type="submit"
                disabled={isProcessing}
                className={`
                    w-full py-3 px-6 rounded-lg font-medium text-white
                    transition-all duration-200 ease-in-out
                    ${isProcessing 
                        ? 'bg-green-700 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    disabled:opacity-75
                    dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500 dark:disabled:bg-green-700 dark:disabled:cursor-not-allowed
                `}
                aria-disabled={isProcessing}
                aria-label={isProcessing ? 'Procesando pago contra entrega' : 'Confirmar pedido con pago contra entrega'}
            >
                <div className="flex items-center justify-center space-x-2">
                    {isProcessing && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    <span>
                        {isProcessing ? 'Procesando...' : 'Confirmar Pedido (Pago contra entrega)'}
                    </span>
                </div>
            </button>
            
            {!isProcessing && (
                <p className="mt-2 text-xs text-gray-500 text-center dark:text-gray-400">
                    Pagarás al recibir tu pedido en el domicilio
                </p>
            )}
        </form>
    );
};

export default CODButton;
