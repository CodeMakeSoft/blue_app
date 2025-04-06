const PaymentMethodSelector = ({ paymentMethods, selectedMethod, onMethodChange }) => (
    <div className="mb-6 space-y-4">
        {Object.entries(paymentMethods).map(([value, label]) => (
            <div key={value} className="flex items-center">
                <input
                    id={`method-${value}`}
                    name="payment-method"
                    type="radio"
                    checked={selectedMethod === value}
                    onChange={() => onMethodChange(value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`method-${value}`} className="ml-3 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            </div>
        ))}
    </div>
);

export default PaymentMethodSelector;