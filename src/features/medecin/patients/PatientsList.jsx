import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { PatientService } from "../services/medecin.services";
import { parseError, resolveArray, resolvePagination } from "../pages/page.utils";

export default function PatientsList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ q: "", page: 1 });
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });

    const fetchRows = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await PatientService.getAll(filters);
            const list = resolveArray(response);
            setRows(list);
            console.log("📦 NORMALIZED LIST:", list);
            setPagination(resolvePagination(response, list.length));
        } catch (err) {
            setError(parseError(err, "Impossible de charger les patients."));
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

    if (loading && rows.length === 0) return <LoadingSpinner text="Chargement des patients..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Patients liés au médecin via rendez-vous et consultations.
                </p>
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
                        placeholder="Nom, email, téléphone..."
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
                        key: "name",
                        label: "Patient",
                        render: (row) => row.user?.name || row.name || "—",
                    },
                    { key: "email", label: "Email", render: (row) => row.user?.email || row.email || "—" },
                    { key: "phone", label: "Téléphone", render: (row) => row.user?.phone || row.phone || "—" },
                ]}
                actions={(row) => (
                    <Link
                        to={`/medecin/patients/${row.id}`}
                        className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700"
                    >
                        Dossier
                    </Link>
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
