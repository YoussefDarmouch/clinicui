import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../../medecin/components/DataTable";
import FilterBar from "../../../medecin/components/FilterBar";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { cancelRendezVousService, getRendezVousService } from "../../services/patient.services";
import { parseError, resolveArray, resolvePagination } from "../page.utils";

export default function RendezVousList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ status: "", page: 1 });
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });

    const fetchRows = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getRendezVousService(filters);
            const list = resolveArray(response);
            setRows(list);
            setPagination(resolvePagination(response, list.length));
        } catch (err) {
            setError(parseError(err, "Impossible de charger les rendez-vous."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRows();
    }, [filters.page, filters.status]);

    const updateFilter = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value, page: name === "page" ? value : 1 }));
    };

    const handleCancel = async (id) => {
        try {
            await cancelRendezVousService(id);
            await fetchRows();
        } catch (err) {
            setError(parseError(err, "Annulation impossible."));
        }
    };

    if (loading && rows.length === 0) return <LoadingSpinner text="Chargement des rendez-vous..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Mes rendez-vous</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Suivi de vos rendez-vous et annulation si nécessaire.
                        </p>
                    </div>
                    <Link
                        to="/patient/rendezvous/new"
                        className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Prendre rendez-vous
                    </Link>
                </div>
            </div>

            <FilterBar>
                <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Statut
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => updateFilter("status", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">Tous</option>
                        <option value="en_attente">En attente</option>
                        <option value="confirme">Confirmé</option>
                        <option value="annule">Annulé</option>
                        <option value="termine">Terminé</option>
                    </select>
                </div>
            </FilterBar>

            {error ? (
                <div className="rounded-2xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
                    {error}
                </div>
            ) : null}

            <DataTable
                rows={rows}
                loading={loading}
                columns={[
                    { key: "id", label: "#" },
                    { key: "date_heure", label: "Date", render: (row) => row.date_heure ? new Date(row.date_heure).toLocaleString("fr-FR") : "—" },
                    { key: "motif", label: "Motif" },
                    { key: "statut", label: "Statut", render: (row) => row.statut || row.status || "—" },
                ]}
                actions={(row) => (
                    <>
                        <Link
                            to={`/patient/rendezvous/${row.id}`}
                            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                            Détails
                        </Link>
                        <button
                            type="button"
                            onClick={() => handleCancel(row.id)}
                            className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700"
                        >
                            Annuler
                        </button>
                    </>
                )}
                pagination={{
                    page: pagination.page,
                    lastPage: pagination.lastPage,
                    total: pagination.total,
                    onPrev: () => updateFilter("page", Math.max(1, pagination.page - 1)),
                    onNext: () => updateFilter("page", Math.min(pagination.lastPage, pagination.page + 1)),
                }}
            />
        </div>
    );
}
