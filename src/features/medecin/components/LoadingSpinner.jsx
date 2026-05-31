export default function LoadingSpinner({ text = "Chargement..." }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
            <p className="mt-3 text-sm text-slate-500">{text}</p>
        </div>
    );
}
