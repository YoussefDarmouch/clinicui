import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { ConsultationService } from "../services/medecin.services";
import { parseError, resolveData } from "../pages/page.utils";
import { getMedicamentsService } from "../../public/services/public.service";

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

const extractList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    return [];
};

export default function ConsultationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consultation, setConsultation] = useState(null);
    const [dossier, setDossier] = useState(null);
    const [medicaments, setMedicaments] = useState([]);
    const [ordonnanceForm, setOrdonnanceForm] = useState({
        valid_until: getInitialValidUntil(),
        instructions: "",
        medicaments: [createEmptyMedicamentRow()],
    });
    const [loading, setLoading] = useState(true);
    const [medicamentsLoading, setMedicamentsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const canSubmitMedicamentRow = useMemo(
        () => ordonnanceForm.medicaments.some((row) => row.medicament_id && row.dose && row.frequency && row.duration_days),
        [ordonnanceForm.medicaments]
    );

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const [consultationRes, dossierRes] = await Promise.all([
                    ConsultationService.getById(id),
                    ConsultationService.dossier(id),
                ]);
                setConsultation(resolveData(consultationRes));
                setDossier(resolveData(dossierRes));
            } catch (err) {
                setError(parseError(err, "Impossible de charger la consultation."));
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    useEffect(() => {
        const fetchMedicaments = async () => {
            setMedicamentsLoading(true);
            try {
                const response = await getMedicamentsService();
                const payload = resolveData(response);
                setMedicaments(extractList(payload));
            } catch (err) {
                setError(parseError(err, "Impossible de charger les médicaments."));
            } finally {
                setMedicamentsLoading(false);
            }
        };

        fetchMedicaments();
    }, []);

    const addMedicamentRow = () => {
        setOrdonnanceForm((prev) => ({
            ...prev,
            medicaments: [...prev.medicaments, createEmptyMedicamentRow()],
        }));
    };

    const removeMedicamentRow = (index) => {
        setOrdonnanceForm((prev) => ({
            ...prev,
            medicaments: prev.medicaments.filter((_, rowIndex) => rowIndex !== index),
        }));
    };

    const updateMedicamentRow = (index, field, value) => {
        setOrdonnanceForm((prev) => ({
            ...prev,
            medicaments: prev.medicaments.map((row, rowIndex) =>
                rowIndex === index ? { ...row, [field]: value } : row
            ),
        }));
    };

    const handleCreateOrdonnance = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                valid_until: ordonnanceForm.valid_until,
                instructions: ordonnanceForm.instructions,
                medicaments: ordonnanceForm.medicaments
                    .filter((row) => row.medicament_id && row.dose && row.frequency && row.duration_days)
                    .map((row) => ({
                        id: Number(row.medicament_id),
                        dose: row.dose,
                        frequency: row.frequency,
                        duration_days: Number(row.duration_days),
                    })),
            };

            const response = await ConsultationService.createOrdonnance(id, payload);
            const responseData = response?.data || response;
            const createdId = responseData?.id || responseData?.data?.id || responseData?.ordonnance?.id;

            setSuccess("Ordonnance créée avec succès.");
            setOrdonnanceForm({
                valid_until: getInitialValidUntil(),
                instructions: "",
                medicaments: [createEmptyMedicamentRow()],
            });

            if (createdId) {
                navigate(`/medecin/ordonnances/${createdId}`);
            } else {
                navigate(`/medecin/consultations/${id}`);
            }
        } catch (err) {
            setError(parseError(err, "Création de l'ordonnance impossible."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner text="Chargement de la consultation..." />;

    if (!consultation) {
        return (
            <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">
                Consultation introuvable.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Consultation #{consultation.id}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {consultation.patient?.name || consultation.patient_name || "Patient non renseigné"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to={`/medecin/consultations/${id}/edit`}
                            className="rounded-xl bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700"
                        >
                            Modifier
                        </Link>
                        <Link
                            to="/medecin/consultations"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                            Retour
                        </Link>
                    </div>
                </div>
            </div>

            {error ? <p className="text-sm text-primary-700">{error}</p> : null}
            {success ? <p className="text-sm text-primary-700">{success}</p> : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Détails consultation</h2>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>Diagnostic: {consultation.diagnostic || "—"}</p>
                        <p>Traitement: {consultation.traitement || "—"}</p>
                        <p>Notes: {consultation.notes || consultation.details?.notes || "—"}</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Dossier médical (résumé)</h2>
                    <pre className="mt-4 max-h-56 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                        {JSON.stringify(dossier || {}, null, 2)}
                    </pre>
                </div>
            </div>

            <form
                id="ordonnance"
                onSubmit={handleCreateOrdonnance}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <h2 className="text-lg font-semibold text-slate-900">
                    Créer une ordonnance depuis la consultation
                </h2>

                <label className="mt-4 block text-sm text-slate-600">Valide jusqu’au</label>
                <input
                    type="date"
                    value={ordonnanceForm.valid_until}
                    onChange={(e) =>
                        setOrdonnanceForm((prev) => ({ ...prev, valid_until: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    required
                />

                <label className="mt-4 block text-sm text-slate-600">Instructions</label>
                <textarea
                    value={ordonnanceForm.instructions}
                    onChange={(e) =>
                        setOrdonnanceForm((prev) => ({ ...prev, instructions: e.target.value }))
                    }
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />

                <div className="mt-6">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-slate-900">Médicaments</h3>
                        <button
                            type="button"
                            onClick={addMedicamentRow}
                            className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700"
                        >
                            Ajouter une ligne
                        </button>
                    </div>

                    {medicamentsLoading ? (
                        <p className="mt-3 text-sm text-slate-500">Chargement des médicaments...</p>
                    ) : null}

                    <div className="mt-4 space-y-4">
                        {ordonnanceForm.medicaments.map((row, index) => (
                            <div key={index} className="rounded-2xl border border-slate-200 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-700">Médicament {index + 1}</p>
                                    {ordonnanceForm.medicaments.length > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => removeMedicamentRow(index)}
                                            className="text-sm font-semibold text-primary-700"
                                        >
                                            Supprimer
                                        </button>
                                    ) : null}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                            placeholder="Ex: 500mg"
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
                                            placeholder="Ex: matin et soir"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">
                                            Durée (jours)
                                        </label>
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
                </div>

                <button
                    type="submit"
                    disabled={saving || !canSubmitMedicamentRow}
                    className="mt-6 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {saving ? "Création..." : "Créer ordonnance"}
                </button>
            </form>
        </div>
    );
}
