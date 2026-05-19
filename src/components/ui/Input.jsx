export default function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder = "",
    name,
    className = "",
}) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 ${className}`}
            />
        </div>
    );
}


