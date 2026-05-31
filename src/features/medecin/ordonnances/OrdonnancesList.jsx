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

    const formatDateTime = (value) => (value ? new Date(value).toLocaleString("fr-FR") : "—");
    const formatDate = (value) => (value ? new Date(value).toLocaleDateString("fr-FR") : "—");
    const truncate = (value, limit = 40) =>
        value && value.length > limit ? `${value.slice(0, limit)}...` : value || "—";

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
                    { key: "consultation_id", label: "Consultation", render: (row) => row.consultation_id || "—" },
                    { key: "patient_id", label: "Patient ID", render: (row) => row.patient_id || "—" },
                    { key: "medecin_id", label: "Médecin ID", render: (row) => row.medecin_id || "—" },
                    { key: "issued_at", label: "Issued At", render: (row) => formatDateTime(row.issued_at) },
                    { key: "valid_until", label: "Valid Until", render: (row) => formatDate(row.valid_until) },
                    {
                        key: "instructions",
                        label: "Instructions",
                        render: (row) => truncate(row.instructions || row.notes),
                    },
                    { key: "statut", label: "Statut", render: (row) => row.statut || "—" },
                    { key: "created_at", label: "Created At", render: (row) => formatDateTime(row.created_at) },
                    { key: "updated_at", label: "Updated At", render: (row) => formatDateTime(row.updated_at) },
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
                        <Link
                            to={`/medecin/ordonnances/${row.id}#medicaments`}
                            className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700"
                        >
                            Créer médicament
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
