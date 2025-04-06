const OrderSummary = ({ cart }) => (
    <>
        <div className="space-y-4 mb-6">
            {cart.map(product => (
                <div key={product.id} className="flex justify-between border-b pb-2">
                    <span>{product.name} (x{product.pivot.quantity})</span>
                    <span>${(product.price * product.pivot.quantity).toFixed(2)}</span>
                </div>
            ))}
        </div>

        <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>$
                    {cart.reduce((sum, product) => 
                        sum + (product.price * product.pivot.quantity), 0
                    ).toFixed(2)}
                </span>
            </div>
        </div>
    </>
);

export default OrderSummary;