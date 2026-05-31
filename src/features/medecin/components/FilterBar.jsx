export default function FilterBar({ children }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">{children}</div>
        </div>
    );
}
