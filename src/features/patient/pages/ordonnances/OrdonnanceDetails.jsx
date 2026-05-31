import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataTable from "../../../medecin/components/DataTable";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import EmptyState from "../../../medecin/components/EmptyState";
import { getOrdonnanceService } from "../../services/patient.services";
import { parseError, resolveArray, resolveData } from "../page.utils";

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
                const response = await getOrdonnanceService(id);
                const payload = resolveData(response);
                setOrdonnance(payload);
                setMedicaments(resolveArray(payload?.medicaments));
            } catch (err) {
                setError(parseError(err, "Impossible de charger l'ordonnance."));
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <LoadingSpinner text="Chargement de l'ordonnance..." />;
    if (!ordonnance) return <EmptyState title="Ordonnance introuvable" />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Ordonnance #{ordonnance.id}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {ordonnance.issued_at ? new Date(ordonnance.issued_at).toLocaleString("fr-FR") : "Aucune date"}
                        </p>
                    </div>
                    <Link to="/patient/ordonnances" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        Retour
                    </Link>
                </div>
                {error ? <p className="mt-3 text-sm text-primary-700">{error}</p> : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Instructions</h2>
                <p className="mt-3 text-sm text-slate-600">{ordonnance.instructions || "—"}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Médicaments</h2>
                <DataTable
                    rows={medicaments}
                    emptyText="Aucun médicament trouvé."
                    columns={[
                        { key: "name", label: "Nom", render: (row) => row.name || "—" },
                        { key: "dosage_form", label: "Forme", render: (row) => row.dosage_form || "—" },
                        { key: "unit", label: "Unité", render: (row) => row.unit || "—" },
                        { key: "dose", label: "Dose", render: (row) => row.pivot?.dose || row.dose || "—" },
                        { key: "frequency", label: "Fréquence", render: (row) => row.pivot?.frequency || row.frequency || "—" },
                        { key: "duration_days", label: "Durée", render: (row) => row.pivot?.duration_days || row.duration_days || "—" },
                    ]}
                />
            </div>
        </div>
    );
}
