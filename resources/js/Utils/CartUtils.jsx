export const TAX_RATE = 0.16;
export const BASE_SHIPPING = 200;

// This function calculates the total amount of the cart
export const calculateCartTotals = (products = [] ) => {
    const subtotal = products.reduce((sum, product) => {
        return sum + (product.price * product.pivot.quantity);
    }, 0);

    const taxes = subtotal * TAX_RATE;
    const shipping = calculateShipping(subtotal);
    const total = subtotal + taxes + shipping;

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
};

// This function calculates the shipping cost
export const calculateShipping = (subtotal) => {
    return subtotal > 400 ? 0 : BASE_SHIPPING;
}

