export default function DataTable({
    columns,
    rows,
    keyField = "id",
    loading = false,
    emptyText = "Aucun résultat trouvé.",
    actions,
    pagination,
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} className="px-4 py-3 font-semibold">
                                    {column.label}
                                </th>
                            ))}
                            {actions ? <th className="px-4 py-3 font-semibold">Actions</th> : null}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr>
                                <td
                                    className="px-4 py-6 text-center text-slate-500"
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                >
                                    Chargement...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    className="px-4 py-6 text-center text-slate-500"
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                <tr key={row[keyField] ?? index} className="hover:bg-slate-50">
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-4 py-3">
                                            {column.render ? column.render(row) : row[column.key] ?? "—"}
                                        </td>
                                    ))}
                                    {actions ? (
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">{actions(row)}</div>
                                        </td>
                                    ) : null}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        Page {pagination.page} / {pagination.lastPage} • Total {pagination.total}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={pagination.onPrev}
                            disabled={pagination.page <= 1}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Précédent
                        </button>
                        <button
                            type="button"
                            onClick={pagination.onNext}
                            disabled={pagination.page >= pagination.lastPage}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
