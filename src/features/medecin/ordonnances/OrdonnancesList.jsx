import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../../../components/ui/Modal";
import { OrdonnanceService } from "../services/medecin.services";
import { parseError, resolveArray, resolvePagination } from "../pages/page.utils";

export default function OrdonnancesList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ q: "", page: 1 });
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchRows = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await OrdonnanceService.getAll(filters);
            const list = resolveArray(response);
            setRows(list);
            setPagination(resolvePagination(response, list.length));
        } catch (err) {
            setError(parseError(err, "Impossible de charger les ordonnances."));
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

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await OrdonnanceService.delete(confirmDelete.id);
            setConfirmDelete(null);
            await fetchRows();
        } catch (err) {
            setError(parseError(err, "Suppression impossible."));
        }
    };

    if (loading && rows.length === 0) return <LoadingSpinner text="Chargement des ordonnances..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Ordonnances</h1>
                <p className="mt-2 text-sm text-slate-500">Historique des ordonnances et médicaments prescrits.</p>
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
                        placeholder="Patient, note..."
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
                        key: "issued_at",
                        label: "Date",
                        render: (row) =>
                            row.issued_at ? new Date(row.issued_at).toLocaleDateString("fr-FR") : "—",
                    },
                    {
                        key: "instructions",
                        label: "Instructions",
                        render: (row) => row.instructions || row.notes || "—",
                    },
                    {
                        key: "statut",
                        label: "Statut",
                        render: (row) => row.statut || "—",
                    },
                ]}
                actions={(row) => (
                    <>
                        <Link
                            to={`/medecin/ordonnances/${row.id}`}
                            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                            Détails
                        </Link>
                        <button
                            type="button"
                            onClick={() => setConfirmDelete({ id: row.id })}
                            className="rounded-xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700"
                        >
                            Supprimer
                        </button>
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

            <Modal isOpen={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
                <h3 className="text-lg font-semibold text-slate-900">Confirmer la suppression</h3>
                <p className="mt-2 text-sm text-slate-500">Cette action est irréversible.</p>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Supprimer
                    </button>
                </div>
            </Modal>
        </div>
    );
}
