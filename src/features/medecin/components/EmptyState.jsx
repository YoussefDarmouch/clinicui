export default function EmptyState({
    title = "Aucune donnée",
    description = "Aucun résultat disponible.",
}) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}
