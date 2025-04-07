import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faChevronLeft, 
  faChevronRight,
  faMinus,
  faPlus,
  faTshirt,
  faPalette,
  faTag,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import Confirm from '@/Components/Confirm';

const ProductItem = ({ 
  product, 
  onQuantityChange, 
  onRemove,
  imageIndex,
  onNextImage,
  onPrevImage
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState(false);
  const [inputQuantity, setInputQuantity] = useState('');

  // Función optimizada con useCallback para cambios rápidos
  const handleQuantityChangeFast = useCallback((newQuantity) => {
    const quantity = Math.max(1, Math.min(product.stock, newQuantity));
    onQuantityChange(product.id, quantity);
  }, [product.id, product.stock, onQuantityChange]);

  // Manejo eficiente de la edición directa
  const handleQuantitySubmit = useCallback((newQuantity) => {
    const quantity = parseInt(newQuantity, 10) || 1;
    handleQuantityChangeFast(quantity);
    setEditingQuantity(false);
  }, [handleQuantityChangeFast]);

  const handleQuantityBlur = useCallback(() => {
    if (inputQuantity !== '') {
      handleQuantitySubmit(inputQuantity);
    }
  }, [inputQuantity, handleQuantitySubmit]);

  // Función para incremento rápido
  const incrementQuantity = useCallback(() => {
    handleQuantityChangeFast(product.pivot.quantity + 1);
  }, [product.pivot.quantity, handleQuantityChangeFast]);

  // Función para decremento rápido
  const decrementQuantity = useCallback(() => {
    handleQuantityChangeFast(product.pivot.quantity - 1);
  }, [product.pivot.quantity, handleQuantityChangeFast]);

  return (
    <li className="flex flex-col md:flex-row items-center gap-6 py-6 relative group">
      {/* Botón eliminar */}
      <button 
        onClick={() => setShowConfirm(true)} 
        className="absolute top-3 left-3 text-gray-400 hover:text-red-600 bg-white p-2 rounded-full shadow-md z-10 transition-all duration-200 hover:scale-110"
        aria-label="Eliminar producto"
      >
        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
      </button>

      {/* Confirmación de eliminación */}
      {showConfirm && (
        <Confirm
          title={`Eliminar "${product.name}"`}
          message="¿Estás seguro de eliminar este producto?"
          onConfirm={() => {
            onRemove(product.id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Imagen con navegación */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
        {product.images.length > 1 && (
          <>
            <button 
              onClick={() => onPrevImage(product.id)} 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 rounded-full hover:bg-black/50 transition-all duration-200"
              aria-label="Imagen anterior"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
            </button>
            <button 
              onClick={() => onNextImage(product.id)} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 rounded-full hover:bg-black/50 transition-all duration-200"
              aria-label="Siguiente imagen"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
            </button>
          </>
        )}
        <img
          src={product.images[imageIndex]?.url || ''}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Detalles del producto */}
      <div className="flex-1 text-center md:text-left space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.description}</p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
          <span className="bg-gray-800 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
            <FontAwesomeIcon icon={faTshirt} className="mr-1.5 w-3 h-3" />
            {product.size}
          </span>
          <span className="bg-gray-800 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
            <FontAwesomeIcon icon={faPalette} className="mr-1.5 w-3 h-3" />
            {product.color}
          </span>
          <span className="bg-gray-800 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
            <FontAwesomeIcon icon={faTag} className="mr-1.5 w-3 h-3" />
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="bg-green-600 text-white rounded-full text-xs font-medium px-3 py-1.5 inline-flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5 w-3 h-3" />
            Stock: {product.stock}
          </span>
        </div>
      </div>

      {/* Controles de cantidad optimizados */}
      <div className="flex flex-col items-center md:items-end gap-3">
        <p className="text-lg font-semibold text-gray-800">
          ${(Number(product.price) * product.pivot.quantity).toFixed(2)}
          <span className="text-sm text-gray-500 ml-1">({product.pivot.quantity} un.)</span>
        </p>
        
        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            disabled={product.pivot.quantity <= 1}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Reducir cantidad"
          >
            <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
          </button>
          
          {editingQuantity ? (
            <input
              type="number"
              min="1"
              max={product.stock}
              value={inputQuantity}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setInputQuantity(value);
                // Actualización en tiempo real mientras se escribe
                if (value !== '' && !isNaN(value)) {
                  handleQuantityChangeFast(parseInt(value, 10));
                }
              }}
              onBlur={handleQuantityBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleQuantitySubmit(inputQuantity)}
              className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <div 
              onClick={() => {
                setEditingQuantity(true);
                setInputQuantity(product.pivot.quantity.toString());
              }}
              className="w-16 text-center border border-transparent hover:border-gray-300 rounded-md py-1 px-2 cursor-text"
            >
              {product.pivot.quantity}
            </div>
          )}
          
          <button
            onClick={incrementQuantity}
            disabled={product.pivot.quantity >= product.stock}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            aria-label="Aumentar cantidad"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ProductItem;