import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const QuantityControl = ({ quantity, stock, onQuantityChange }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleBlur = () => {
    const newQuantity = parseInt(inputValue, 10);
    if (!isNaN(newQuantity)) {
      const validatedQty = Math.max(1, Math.min(stock, newQuantity));
      onQuantityChange(validatedQty);
    }
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center md:items-end gap-3">
      <p className="text-lg font-semibold text-gray-800">
        ${(product.price * quantity).toFixed(2)}
        <span className="text-sm text-gray-500 ml-1">({quantity} un.)</span>
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onQuantityChange(Math.max(quantity - 1, 1))}
          disabled={quantity <= 1}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
        </button>
        
        {editing ? (
          <input
            type="number"
            min="1"
            max={stock}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            onClick={() => {
              setEditing(true);
              setInputValue(quantity.toString());
            }}
            className="w-16 text-center border border-transparent hover:border-gray-300 rounded-md py-1 px-2 cursor-text"
          >
            {quantity}
          </div>
        )}
        
        <button
          onClick={() => onQuantityChange(Math.min(quantity + 1, stock))}
          disabled={quantity >= stock}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default QuantityControl;