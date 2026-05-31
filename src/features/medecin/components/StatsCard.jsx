export default function StatsCard({ label, value, helper }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{value ?? 0}</p>
            {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
        </div>
    );
}
