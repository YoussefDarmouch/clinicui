import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../../medecin/components/DataTable";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getOrdonnancesService } from "../../services/patient.services";
import { parseError, resolveArray } from "../page.utils";

export default function OrdonnancesList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRows = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getOrdonnancesService();
                setRows(resolveArray(response));
            } catch (err) {
                setError(parseError(err, "Impossible de charger les ordonnances."));
            } finally {
                setLoading(false);
            }
        };

        fetchRows();
    }, []);

    if (loading) return <LoadingSpinner text="Chargement des ordonnances..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Mes ordonnances</h1>
                <p className="mt-2 text-sm text-slate-500">Liste de vos prescriptions médicales.</p>
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
                        key: "issued_at",
                        label: "Date",
                        render: (row) => (row.issued_at ? new Date(row.issued_at).toLocaleDateString("fr-FR") : "—"),
                    },
                    { key: "instructions", label: "Instructions", render: (row) => row.instructions || "—" },
                    { key: "statut", label: "Statut", render: (row) => row.statut || "—" },
                ]}
                actions={(row) => (
                    <Link
                        to={`/patient/ordonnances/${row.id}`}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                        Détails
                    </Link>
                )}
            />
        </div>
    );
}
