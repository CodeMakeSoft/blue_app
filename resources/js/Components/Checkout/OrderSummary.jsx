    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { 
    faBox, 
    faReceipt, 
    faMoneyBillWave,
    faTruck,
    faTag
    } from '@fortawesome/free-solid-svg-icons';

    const OrderSummary = ({ cart }) => {
    const subtotal = cart.reduce((sum, product) => sum + (product.price * product.pivot.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Envío gratis para compras > $50
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="bg-blue-50 p-2 rounded-lg">
            <FontAwesomeIcon icon={faReceipt} className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Resumen de Pedido</h3>
        </div>

        {/* Lista de productos */}
        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {cart.map(product => (
            <div key={`${product.id}-${product.pivot.quantity}`} className="flex justify-between items-start py-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="bg-gray-100 p-1.5 rounded-md mt-0.5">
                    <FontAwesomeIcon icon={faBox} className="text-gray-500 text-sm" />
                </div>
                <div className="min-w-0">
                    <p className="text-gray-800 font-medium truncate">{product.name}</p>
                    <p className="text-gray-500 text-sm">
                    {product.color} | {product.size}
                    </p>
                </div>
                </div>
                <div className="ml-4 text-right whitespace-nowrap">
                <p className="font-medium text-gray-900">
                    ${((parseFloat(product.price)) * (product.pivot.quantity)).toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm">
                    {product.pivot.quantity} × ${parseFloat(product.price).toFixed(2)}
                </p>
                </div>
            </div>
            ))}
        </div>

        {/* Desglose de costos */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTag} className="text-gray-400 text-sm" />
                Subtotal
            </span>
            <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} className={shipping > 0 ? 'text-gray-400' : 'text-green-500'} />
                Envío
            </span>
            <span className={shipping > 0 ? '' : 'text-green-600 font-medium'}>
                {shipping > 0 ? `$${shipping.toFixed(2)}` : '¡Gratis!'}
            </span>
            </div>
            
            <div className="flex justify-between text-gray-600 mb-2">
            <span>Impuestos (10%):</span>
            <span>${tax.toFixed(2)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200 mt-2">
            <span className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500" />
                Total
            </span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
        </div>

        {/* Nota responsiva */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <FontAwesomeIcon icon={faReceipt} className="mt-0.5 flex-shrink-0" />
            <span>
            {shipping > 0 ? (
                <>¡Gastos de envío gratis en compras mayores a $50!</>
            ) : (
                <>¡Felicidades! Tienes envío gratis</>
            )}
            </span>
        </div>
        </div>
    );
    };

    export default OrderSummary;