import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../../../components/ui/Modal";
import { ConsultationService, OrdonnanceService } from "../services/medecin.services";
import { getMedicamentsService } from "../../public/services/public.service";
import { parseError, resolveArray, resolvePagination } from "../pages/page.utils";

const createEmptyMedicamentRow = () => ({
    medicament_id: "",
    dose: "",
    frequency: "",
    duration_days: "",
});

const getInitialValidUntil = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().slice(0, 10);
};

export default function OrdonnancesList() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ q: "", page: 1 });
    const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [consultations, setConsultations] = useState([]);
    const [medicaments, setMedicaments] = useState([]);
    const [createLoading, setCreateLoading] = useState(false);
    const [createForm, setCreateForm] = useState({
        consultation_id: "",
        valid_until: getInitialValidUntil(),
        instructions: "",
        medicaments: [createEmptyMedicamentRow()],
    });

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

    useEffect(() => {
        const fetchCreateData = async () => {
            try {
                const [consultationsRes, medicamentsRes] = await Promise.all([
                    ConsultationService.getAll({ page: 1 }),
                    getMedicamentsService(),
                ]);
                setConsultations(resolveArray(consultationsRes));
                setMedicaments(resolveArray(medicamentsRes));
            } catch (err) {
                setError(parseError(err, "Impossible de charger les données de création."));
            }
        };

        fetchCreateData();
    }, []);

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

    const addMedicamentRow = () => {
        setCreateForm((prev) => ({
            ...prev,
            medicaments: [...prev.medicaments, createEmptyMedicamentRow()],
        }));
    };

    const removeMedicamentRow = (index) => {
        setCreateForm((prev) => ({
            ...prev,
            medicaments: prev.medicaments.filter((_, rowIndex) => rowIndex !== index),
        }));
    };

    const updateMedicamentRow = (index, field, value) => {
        setCreateForm((prev) => ({
            ...prev,
            medicaments: prev.medicaments.map((row, rowIndex) =>
                rowIndex === index ? { ...row, [field]: value } : row
            ),
        }));
    };

    const handleCreateOrdonnance = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setError("");
        try {
            const payload = {
                valid_until: createForm.valid_until,
                instructions: createForm.instructions,
                medicaments: createForm.medicaments
                    .filter((row) => row.medicament_id && row.dose && row.frequency && row.duration_days)
                    .map((row) => ({
                        id: Number(row.medicament_id),
                        dose: row.dose,
                        frequency: row.frequency,
                        duration_days: Number(row.duration_days),
                    })),
            };

            const response = await ConsultationService.createOrdonnance(
                createForm.consultation_id,
                payload
            );
            const responseData = response?.data || response;
            const createdId = responseData?.id || responseData?.data?.id || responseData?.ordonnance?.id;

            setShowCreateModal(false);
            setCreateForm({
                consultation_id: "",
                valid_until: getInitialValidUntil(),
                instructions: "",
                medicaments: [createEmptyMedicamentRow()],
            });

            await fetchRows();

            if (createdId) {
                navigate(`/medecin/ordonnances/${createdId}`);
            }
        } catch (err) {
            setError(parseError(err, "Création de l'ordonnance impossible."));
        } finally {
            setCreateLoading(false);
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Ordonnances</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Historique des ordonnances et médicaments prescrits.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Nouvelle ordonnance
                    </button>
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

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <form onSubmit={handleCreateOrdonnance} className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Nouvelle ordonnance</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Créez l’ordonnance et ses médicaments dans une seule requête.
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Consultation</label>
                        <select
                            value={createForm.consultation_id}
                            onChange={(e) =>
                                setCreateForm((prev) => ({ ...prev, consultation_id: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            required
                        >
                            <option value="">Sélectionner une consultation</option>
                            {consultations.map((consultation) => (
                                <option key={consultation.id} value={consultation.id}>
                                    #{consultation.id} - {consultation.patient?.name || consultation.patient_name || "Patient"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Valide jusqu’au</label>
                        <input
                            type="date"
                            value={createForm.valid_until}
                            onChange={(e) =>
                                setCreateForm((prev) => ({ ...prev, valid_until: e.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Instructions</label>
                        <textarea
                            value={createForm.instructions}
                            onChange={(e) =>
                                setCreateForm((prev) => ({ ...prev, instructions: e.target.value }))
                            }
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h4 className="text-base font-semibold text-slate-900">Médicaments</h4>
                            <button
                                type="button"
                                onClick={addMedicamentRow}
                                className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700"
                            >
                                Ajouter une ligne
                            </button>
                        </div>

                        {createForm.medicaments.map((row, index) => (
                            <div key={index} className="rounded-2xl border border-slate-200 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-700">Médicament {index + 1}</p>
                                    {createForm.medicaments.length > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => removeMedicamentRow(index)}
                                            className="text-sm font-semibold text-primary-700"
                                        >
                                            Supprimer
                                        </button>
                                    ) : null}
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm text-slate-600">Médicament</label>
                                        <select
                                            value={row.medicament_id}
                                            onChange={(e) =>
                                                updateMedicamentRow(index, "medicament_id", e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                            required
                                        >
                                            <option value="">Sélectionner un médicament</option>
                                            {medicaments.map((medicament) => (
                                                <option key={medicament.id} value={medicament.id}>
                                                    {medicament.nom || medicament.name || `Médicament #${medicament.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Dose</label>
                                        <input
                                            type="text"
                                            value={row.dose}
                                            onChange={(e) => updateMedicamentRow(index, "dose", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Fréquence</label>
                                        <input
                                            type="text"
                                            value={row.frequency}
                                            onChange={(e) =>
                                                updateMedicamentRow(index, "frequency", e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Durée (jours)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={row.duration_days}
                                            onChange={(e) =>
                                                updateMedicamentRow(index, "duration_days", e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={createLoading}
                            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {createLoading ? "Création..." : "Créer ordonnance"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
