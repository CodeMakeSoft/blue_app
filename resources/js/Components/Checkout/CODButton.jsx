const CODButton = ({ isProcessing, onSubmit }) => (
    <form onSubmit={onSubmit}>
        <button
            type="submit"
            disabled={isProcessing}
            className={`w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 ${isProcessing ? 'opacity-50' : ''}`}
        >
            {isProcessing ? 'Procesando...' : 'Confirmar Pedido (Pago contra entrega)'}
        </button>
    </form>
);

export default CODButton;