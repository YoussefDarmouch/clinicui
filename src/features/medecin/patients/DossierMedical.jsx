import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";

export default function DossierMedical({
    dossier,
    consultations,
    rendezvous,
    ordonnances,
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Résumé médical</h2>
                <pre className="mt-3 max-h-44 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    {JSON.stringify(dossier || {}, null, 2)}
                </pre>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Historique des consultations</h3>
                {consultations.length === 0 ? (
                    <EmptyState
                        title="Aucune consultation"
                        description="Ce patient n'a pas de consultation enregistrée."
                    />
                ) : (
                    <DataTable
                        rows={consultations}
                        columns={[
                            {
                                key: "date_consultation",
                                label: "Date",
                                render: (row) =>
                                    row.date_consultation
                                        ? new Date(row.date_consultation).toLocaleString("fr-FR")
                                        : "—",
                            },
                            { key: "diagnostic", label: "Diagnostic" },
                            { key: "traitement", label: "Traitement" },
                        ]}
                    />
                )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Historique des rendez-vous</h3>
                {rendezvous.length === 0 ? (
                    <EmptyState
                        title="Aucun rendez-vous"
                        description="Ce patient n'a pas de rendez-vous enregistrés."
                    />
                ) : (
                    <DataTable
                        rows={rendezvous}
                        columns={[
                            {
                                key: "date_heure",
                                label: "Date/heure",
                                render: (row) =>
                                    row.date_heure ? new Date(row.date_heure).toLocaleString("fr-FR") : "—",
                            },
                            { key: "statut", label: "Statut", render: (row) => row.statut || row.status || "—" },
                            { key: "motif", label: "Motif" },
                        ]}
                    />
                )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Historique des ordonnances</h3>
                {ordonnances.length === 0 ? (
                    <EmptyState
                        title="Aucune ordonnance"
                        description="Ce patient n'a pas encore d'ordonnance."
                    />
                ) : (
                    <DataTable
                        rows={ordonnances}
                        columns={[
                            { key: "id", label: "#" },
                            { key: "date", label: "Date", render: (row) => row.date || row.created_at || "—" },
                            { key: "notes", label: "Notes" },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}
