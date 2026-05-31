import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../../medecin/components/DataTable";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getConsultationsService } from "../../services/patient.services";
import { parseError, resolveArray } from "../page.utils";

export default function ConsultationsList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRows = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getConsultationsService();
                setRows(resolveArray(response));
            } catch (err) {
                setError(parseError(err, "Impossible de charger les consultations."));
            } finally {
                setLoading(false);
            }
        };

        fetchRows();
    }, []);

    if (loading) return <LoadingSpinner text="Chargement des consultations..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Mes consultations</h1>
                <p className="mt-2 text-sm text-slate-500">Historique de vos consultations médicales.</p>
            </div>

            {error ? (
                <div className="rounded-2xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
                    {error}
                </div>
            ) : null}

            <DataTable
                rows={rows}
                columns={[
                    { key: "id", label: "#" },
                    {
                        key: "date_consultation",
                        label: "Date",
                        render: (row) => (row.date_consultation ? new Date(row.date_consultation).toLocaleString("fr-FR") : "—"),
                    },
                    { key: "diagnostic", label: "Diagnostic" },
                    { key: "traitement", label: "Traitement" },
                ]}
                actions={(row) => (
                    <Link
                        to={`/patient/consultations/${row.id}`}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                        Détails
                    </Link>
                )}
            />
        </div>
    );
}
