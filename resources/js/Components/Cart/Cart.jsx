import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const Cart = ({ cartItems }) => {
  const [cart, setCart] = useState(cartItems || []);


  const addToCart = (product) => {
    const itemInCart = cart.find((item) => item.id === product.id);

    if (itemInCart) {

      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {

      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };


  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };


  const decreaseQuantity = (productId) => {
    setCart(
      cart.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };


  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>

      {/* Mostrar */}
      {cart.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <ul className="space-y-2">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center"
            >
              <div className="flex space-x-2">
                <span>{item.name}</span>
                <span className="text-sm text-gray-500">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  +
                </button>
                <span className="text-sm">{item.quantity}</span>
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  -
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Mostrar el total */}
      {cart.length > 0 && (
        <div className="mt-4 flex justify-between">
          <span className="font-bold">Total:</span>
          <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
      )}

      {/* Botón para finalizar la compra PENDIENTE*/}
      {cart.length > 0 && (
        <div className="mt-4">
          <Link
            href="/checkout"
            method="post"
            as="button"
            type="button"
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Finalizar Compra
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;