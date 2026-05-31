import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { ConsultationService } from "../services/medecin.services";
import { parseError, resolveArray, resolvePagination } from "../pages/page.utils";

export default function ConsultationsList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ q: "", page: 1 });
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });

    const fetchRows = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await ConsultationService.getAll(filters);
            const list = resolveArray(response);
            setRows(list);
            setPagination(resolvePagination(response, list.length));
        } catch (err) {
            setError(parseError(err, "Impossible de charger les consultations."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRows();
    }, [filters.page, filters.q]);

    const updateFilter = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value, page: name === "page" ? value : 1 }));
    };

    if (loading && rows.length === 0) return <LoadingSpinner text="Chargement des consultations..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Consultations</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Suivi des consultations et création d'ordonnances.
                        </p>
                    </div>
                    <Link
                        to="/medecin/consultations/new"
                        className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Nouvelle consultation
                    </Link>
                </div>
            </div>

            <FilterBar>
                <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Recherche
                    </label>
                    <input
                        type="search"
                        value={filters.q}
                        onChange={(e) => updateFilter("q", e.target.value)}
                        placeholder="Patient, diagnostic..."
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
                        render: (row) => row.patient?.name || row.patient_name || "—",
                    },
                    {
                        key: "poids",
                        label: "Poids",
                        render: (row) => row.details.poids || "—",
                    },
                    {
                        key: "tension",
                        label: "Tension",
                        render: (row) => row.details.tension || "—",
                    },
                    {
                        key: "temperature",
                        label: "Température",
                        render: (row) => row.details.temperature || "—",
                    },
                    { key: "diagnostic", label: "Diagnostic" },
                    {
                        key: "date_consultation",
                        label: "Date",
                        render: (row) =>
                            row.date_consultation
                                ? new Date(row.date_consultation).toLocaleString("fr-FR")
                                : "—",
                    },
                ]}
                actions={(row) => (
                    <>
                        <Link
                            to={`/medecin/consultations/${row.id}`}
                            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                            Détails
                        </Link>
                        <Link
                            to={`/medecin/consultations/${row.id}/edit`}
                            className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700"
                        >
                            Modifier
                        </Link>
                        <Link
                            to={`/medecin/consultations/${row.id}#ordonnance`}
                            className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700"
                        >
                            Créer ordonnance
                        </Link>
                    </>
                )}
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
