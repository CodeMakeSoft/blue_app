import React from 'react';

const PaymentMethodSelector = ({ paymentMethods, selectedMethod, onMethodChange }) => (
    <div className="space-y-3 mb-[2rem]">
        {Object.entries(paymentMethods).map(([value, label]) => (
            <div 
                key={value} 
                className="relative flex items-start py-3 px-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:border-gray-600"
                onClick={() => onMethodChange(value)}
            >
                <div className="flex items-center h-5">
                    <input
                        id={`method-${value}`}
                        name="payment-method"
                        type="radio"
                        checked={selectedMethod === value}
                        onChange={() => {}}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        aria-labelledby={`method-${value}-label`}
                    />
                </div>
                <div className="ml-3 flex flex-col">
                    <label 
                        id={`method-${value}-label`}
                        htmlFor={`method-${value}`} 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                        {label}
                    </label>
                </div>
                {selectedMethod === value && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        <svg className="h-5 w-5 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        ))}
    </div>
);

export default PaymentMethodSelector;
