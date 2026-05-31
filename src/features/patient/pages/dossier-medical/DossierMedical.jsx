import { useEffect, useState } from "react";
import DataTable from "../../../medecin/components/DataTable";
import EmptyState from "../../../medecin/components/EmptyState";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getDossierMedicalService } from "../../services/patient.services";
import { parseError, resolveArray, resolveData } from "../page.utils";

export default function DossierMedical() {
    const [dossier, setDossier] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [rendezvous, setRendezvous] = useState([]);
    const [ordonnances, setOrdonnances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDossier = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getDossierMedicalService();
                const payload = resolveData(response) || {};
                setDossier(payload);
                setConsultations(resolveArray(payload.consultations || payload.consultations_history));
                setRendezvous(resolveArray(payload.rendezvous || payload.appointments));
                setOrdonnances(resolveArray(payload.ordonnances || payload.prescriptions));
            } catch (err) {
                setError(parseError(err, "Impossible de charger le dossier médical."));
            } finally {
                setLoading(false);
            }
        };

        fetchDossier();
    }, []);

    if (loading) return <LoadingSpinner text="Chargement du dossier médical..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Mon dossier médical</h1>
                <p className="mt-2 text-sm text-slate-500">Résumé de vos informations médicales et historique.</p>
                {error ? <p className="mt-3 text-sm text-primary-700">{error}</p> : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Résumé</h2>
                <pre className="mt-3 max-h-44 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    {JSON.stringify(dossier || {}, null, 2)}
                </pre>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Consultations</h2>
                {consultations.length === 0 ? (
                    <EmptyState title="Aucune consultation" description="Aucune consultation enregistrée." />
                ) : (
                    <DataTable
                        rows={consultations}
                        columns={[
                            {
                                key: "date_consultation",
                                label: "Date",
                                render: (row) =>
                                    row.date_consultation ? new Date(row.date_consultation).toLocaleString("fr-FR") : "—",
                            },
                            { key: "diagnostic", label: "Diagnostic" },
                            { key: "traitement", label: "Traitement" },
                        ]}
                    />
                )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Rendez-vous</h2>
                {rendezvous.length === 0 ? (
                    <EmptyState title="Aucun rendez-vous" description="Aucun rendez-vous enregistré." />
                ) : (
                    <DataTable
                        rows={rendezvous}
                        columns={[
                            {
                                key: "date_heure",
                                label: "Date/heure",
                                render: (row) => (row.date_heure ? new Date(row.date_heure).toLocaleString("fr-FR") : "—"),
                            },
                            { key: "motif", label: "Motif" },
                            { key: "statut", label: "Statut", render: (row) => row.statut || row.status || "—" },
                        ]}
                    />
                )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Ordonnances</h2>
                {ordonnances.length === 0 ? (
                    <EmptyState title="Aucune ordonnance" description="Aucune ordonnance disponible." />
                ) : (
                    <DataTable
                        rows={ordonnances}
                        columns={[
                            { key: "id", label: "#" },
                            {
                                key: "issued_at",
                                label: "Date",
                                render: (row) => (row.issued_at ? new Date(row.issued_at).toLocaleDateString("fr-FR") : "—"),
                            },
                            { key: "instructions", label: "Instructions", render: (row) => row.instructions || "—" },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}
