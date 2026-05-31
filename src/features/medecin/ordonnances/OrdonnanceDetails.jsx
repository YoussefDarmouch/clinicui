import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import DataTable from "../components/DataTable";
import { OrdonnanceService } from "../services/medecin.services";
import { parseError, resolveArray, resolveData } from "../pages/page.utils";

export default function OrdonnanceDetails() {
    const { id } = useParams();
    const [ordonnance, setOrdonnance] = useState(null);
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const [ordonnanceRes, medicamentsRes] = await Promise.all([
                    OrdonnanceService.getById(id),
                    OrdonnanceService.medicaments(id),
                ]);
                setOrdonnance(resolveData(ordonnanceRes));
                setMedicaments(resolveArray(medicamentsRes));
            } catch (err) {
                setError(parseError(err, "Impossible de charger l'ordonnance."));
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <LoadingSpinner text="Chargement ordonnance..." />;

    if (!ordonnance) return <EmptyState title="Ordonnance introuvable" />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Ordonnance #{ordonnance.id}</h1>
                        <p className="mt-2 text-sm text-slate-500">{ordonnance.notes || "Aucune note"}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-xl bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700"
                        >
                            Imprimer
                        </button>
                        <Link
                            to="/medecin/ordonnances"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                            Retour
                        </Link>
                    </div>
                </div>
                {error ? <p className="mt-3 text-sm text-primary-700">{error}</p> : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Médicaments</h2>
                <DataTable
                    rows={medicaments}
                    emptyText="Aucun médicament trouvé."
                    columns={[
                        { key: "name", label: "Nom", render: (row) => row.name || row.nom || "—" },
                        {
                            key: "dosage_form",
                            label: "Forme",
                            render: (row) => row.dosage_form || "—",
                        },
                        { key: "unit", label: "Unité", render: (row) => row.unit || "—" },
                        { key: "dose", label: "Dose", render: (row) => row.pivot?.dose || row.dose || "—" },
                        {
                            key: "frequency",
                            label: "Fréquence",
                            render: (row) => row.pivot?.frequency || row.frequency || "—",
                        },
                        {
                            key: "duration_days",
                            label: "Durée (jours)",
                            render: (row) => row.pivot?.duration_days || row.duration_days || "—",
                        },
                    ]}
                />
            </div>
        </div>
    );
}
