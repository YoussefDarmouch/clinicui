import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { RendezVousService } from "../services/medecin.services";
import { parseError, resolveArray, resolvePagination } from "../pages/page.utils";

export default function RendezVousList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ status: "", date: "", page: 1 });
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });

    const fetchRows = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await RendezVousService.getAll(filters);
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
    }, [filters.page, filters.status, filters.date]);

    const updateFilter = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value, page: name === "page" ? value : 1 }));
    };

    const normalizeStatus = (value) => (value || "").toString().toLowerCase();

    const updateRowStatus = (id, nextStatus) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, statut: nextStatus, status: nextStatus } : row
            )
        );
    };

    const runAction = async (action, id) => {
        try {
            let response = null;
            let nextStatus = null;

            if (action === "confirm") {
                response = await RendezVousService.confirm(id);
                nextStatus = "confirme";
            }

            if (action === "cancel") {
                response = await RendezVousService.cancel(id);
                nextStatus = "annule";
            }

            if (action === "complete") {
                response = await RendezVousService.complete(id);
                nextStatus = "termine";
            }

            const updated = response?.data?.data || response?.data || response;
            if (updated?.id) {
                setRows((prev) =>
                    prev.map((row) => (row.id === updated.id ? { ...row, ...updated } : row))
                );
            } else if (nextStatus) {
                updateRowStatus(id, nextStatus);
            }

            await fetchRows();
        } catch (err) {
            setError(parseError(err, "Action non exécutée."));
        }
    };

    if (loading && rows.length === 0) return <LoadingSpinner text="Chargement des rendez-vous..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Rendez-vous</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Gestion des rendez-vous: confirmation, annulation et clôture.
                </p>
            </div>

            <FilterBar>
                <div>
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
                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Date
                    </label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => updateFilter("date", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
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
                    {
                        key: "patient",
                        label: "Patient",
                        render: (row) => row.patient?.user?.name || row.patient?.name || row.patient_name || "—",
                    },
                    {
                        key: "date_heure",
                        label: "Date/heure",
                        render: (row) =>
                            row.date_heure ? new Date(row.date_heure).toLocaleString("fr-FR") : "—",
                    },
                    { key: "statut", label: "Statut", render: (row) => row.statut || row.status || "—" },
                ]}
                actions={(row) => {
                    const status = normalizeStatus(row.statut || row.status);

                    return (
                        <>
                            <Link
                                to={`/medecin/rendezvous/${row.id}`}
                                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                            >
                                Détails
                            </Link>
                            <button
                                type="button"
                                onClick={() => runAction("confirm", row.id)}
                                disabled={["confirme", "confirmed"].includes(status)}
                                className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Confirmer
                            </button>
                            <button
                                type="button"
                                onClick={() => runAction("cancel", row.id)}
                                disabled={["annule", "cancelled", "canceled"].includes(status)}
                                className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={() => runAction("complete", row.id)}
                                disabled={["termine", "completed"].includes(status)}
                                className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Terminer
                            </button>
                        </>
                    );
                }}
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
