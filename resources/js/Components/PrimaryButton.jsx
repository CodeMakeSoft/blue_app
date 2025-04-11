export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
                bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500
                text-white font-medium py-2 px-4 rounded-full shadow-sm
                hover:shadow-lg transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                dark:focus:ring-offset-gray-800
                active:scale-95 active:shadow-inner active:bg-blue-800 dark:active:bg-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
}
