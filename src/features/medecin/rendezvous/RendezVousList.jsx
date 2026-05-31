import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { RendezVousService } from "../services/medecin.services";
import { parseError, resolveArray, resolvePagination } from "../pages/page.utils";

export default function RendezVousList() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ status: "", date: "", page: 1 });
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const normalizeStatus = (value) => (value || "").toString().toLowerCase();

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
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: name === "page" ? value : 1,
        }));
    };

    const runAction = async (action, id) => {
        setActionLoadingId(id);
        setError("");

        try {
            let response = null;

            if (action === "confirm") {
                response = await RendezVousService.confirm(id);
            } else if (action === "cancel") {
                response = await RendezVousService.cancel(id);
            } else if (action === "complete") {
                response = await RendezVousService.complete(id);
            }

            const updated = response?.data?.data || response?.data || response;
            if (updated?.id) {
                setRows((prev) =>
                    prev.map((row) => (row.id === updated.id ? { ...row, ...updated } : row))
                );
            }

            await fetchRows();

            if (action === "complete") {
                navigate(`/medecin/consultations/create?rdv_id=${id}`);
            }
        } catch (err) {
            setError(parseError(err, "Action non exécutée."));
        } finally {
            setActionLoadingId(null);
        }
    };

    if (loading && rows.length === 0) {
        return <LoadingSpinner text="Chargement des rendez-vous..." />;
    }

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
                        className="w-full rounded-xl border px-3 py-2 text-sm"
                    >
                        <option value="">Tous</option>
                        <option value="planifie">Planifié</option>
                        <option value="confirme">Confirmé</option>
                        <option value="annule">Annulé</option>
                        <option value="complete">Terminé</option>
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
                        className="w-full rounded-xl border px-3 py-2 text-sm"
                    />
                </div>
            </FilterBar>

            {error ? (
                <div className="rounded-2xl border bg-red-50 p-3 text-sm text-red-700">
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
                        render: (row) =>
                            row.patient?.user?.name ||
                            row.patient?.name ||
                            row.patient_name ||
                            "—",
                    },
                    {
                        key: "date_heure",
                        label: "Date/heure",
                        render: (row) =>
                            row.date_heure
                                ? new Date(row.date_heure).toLocaleString("fr-FR")
                                : "—",
                    },
                    {
                        key: "statut",
                        label: "Statut",
                        render: (row) => row.statut || "—",
                    },
                ]}
                actions={(row) => {
                    const status = normalizeStatus(row.statut);
                    const isLoading = actionLoadingId === row.id;

                    if (status === "annule") {
                        return (
                            <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold">
                                Annulé
                            </span>
                        );
                    }

                    if (status === "complete") {
                        return (
                            <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold">
                                Terminé
                            </span>
                        );
                    }

                    return (
                        <>
                            <Link
                                to={`/medecin/rendezvous/${row.id}`}
                                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold"
                            >
                                Détails
                            </Link>

                            {status === "planifie" && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => runAction("confirm", row.id)}
                                        disabled={isLoading}
                                        className="rounded-xl bg-green-100 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {isLoading ? "..." : "Confirmer"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => runAction("cancel", row.id)}
                                        disabled={isLoading}
                                        className="rounded-xl bg-red-100 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {isLoading ? "..." : "Annuler"}
                                        </button>
                                </>
                            )}

                            {status === "confirme" && (
                                <button
                                    type="button"
                                    onClick={() => runAction("complete", row.id)}
                                    disabled={isLoading}
                                    className="rounded-xl bg-blue-100 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {isLoading ? "..." : "Terminer"}
                                </button>
                            )}
                        </>
                    );
                }}
                pagination={{
                    page: pagination.page,
                    lastPage: pagination.lastPage,
                    total: pagination.total,
                    onPrev: () => updateFilter("page", Math.max(1, pagination.page - 1)),
                    onNext: () =>
                        updateFilter("page", Math.min(pagination.lastPage, pagination.page + 1)),
                }}
            />
        </div>
    );
}
