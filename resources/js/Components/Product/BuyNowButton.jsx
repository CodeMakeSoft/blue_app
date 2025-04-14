// resources/js/Components/Product/BuyNowButton.jsx
import { useState } from "react";
import axios from "axios";

const BuyNowButton = ({ productId, total, paymentMethods }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handleBuyNow = async () => {
        setLoading(true);
        try {
            // Realizamos la solicitud para crear la orden
            const response = await axios.post(route("checkout.purchase"), {
                product_id: productId,
                quantity: 1,
                payment_method: paymentMethod,
            });

            if (paymentMethod === "paypal") {
                // Si el pago es con PayPal, ya estamos redirigiendo en el backend
                window.location.href = response.data.redirect_url;
            } else {
                // Si es COD, mostramos el éxito
                alert("¡Tu compra ha sido registrada exitosamente!");
            }
        } catch (error) {
            console.error("Error al procesar la compra", error);
            alert("Hubo un problema al procesar la compra. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-5">Resumen de compra</h3>
            <p>Producto: ${total}</p>

            <div className="mt-5">
                <label className="block mb-2">Método de pago</label>
                <select
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="p-2 border rounded-lg w-full"
                >
                    <option value="">Seleccione un método de pago</option>
                    {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                            {method === "paypal" ? "Pago con PayPal" : "Pago contra entrega"}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-5">
                <button
                    onClick={handleBuyNow}
                    disabled={loading || !paymentMethod}
                    className={`${
                        loading || !paymentMethod
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white py-2 px-6 rounded-lg`}
                >
                    {loading ? "Procesando..." : "Finalizar compra"}
                </button>
            </div>
        </div>
    );
};

export default BuyNowButton;
