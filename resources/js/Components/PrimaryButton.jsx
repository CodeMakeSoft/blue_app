export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        // En tu componente PrimaryButton (o donde tengas definido el botón)
        <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-medium py-2 px-4 rounded transition-colors"
        >
            Guardar cambios
        </button>
    );
}
