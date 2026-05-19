export default function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}

