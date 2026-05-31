import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getMedecins, getAvailableSlots } from "../../../../api/public.api";
import {
    createRendezVousService,
    getRendezVousByIdService,
    updateRendezVousService,
} from "../../services/patient.services";
import { parseError, resolveData } from "../page.utils";

export default function RendezVousForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const today = new Date().toISOString().split("T")[0];
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [error, setError] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [form, setForm] = useState({
        medecin_id: "",
        date: "",
        slot: "",
        motif: "",
        notes: "",
    });

    const toDateTime = (value) => {
        if (!value) return null;
        const normalized = String(value).trim().replace(" ", "T");
        const parsed = new Date(normalized);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const isFutureSlot = (slotValue) => {
        const parsed = toDateTime(slotValue);
        return parsed ? parsed.getTime() > Date.now() : false;
    };

    const visibleSlots = availableSlots.filter((slot) => {
        const slotValue =
            typeof slot === "string"
                ? slot
                : slot?.date_heure || slot?.value || "";
        return slotValue ? isFutureSlot(slotValue) : false;
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getMedecins();
                const payload = resolveData(response);
                setDoctors(Array.isArray(payload) ? payload : payload?.data || []);
            } catch (err) {
                setError(parseError(err, "Impossible de charger la liste des médecins."));
            }
        };

        const fetchDetails = async () => {
            if (!isEdit) return;
            try {
                const response = await getRendezVousByIdService(id);
                const payload = resolveData(response) || {};
                setForm({
                    medecin_id: payload.medecin_id || "",
                    date: payload.date_heure ? String(payload.date_heure).slice(0, 10) : "",
                    slot: payload.date_heure || "",
                    motif: payload.motif || "",
                    notes: payload.notes || "",
                });
            } catch (err) {
                setError(parseError(err, "Impossible de charger le rendez-vous."));
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
        fetchDetails();
        if (!isEdit) setLoading(false);
    }, [id, isEdit]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!form.medecin_id || !form.date) return;
            setSlotsLoading(true);
            try {
                const response = await getAvailableSlots(form.medecin_id, form.date);
                setAvailableSlots(resolveData(response) || []);
                setForm((prev) => ({ ...prev, slot: "" }));
            } catch (err) {
                setAvailableSlots([]);
                setError(parseError(err, "Impossible de charger les créneaux."));
            } finally {
                setSlotsLoading(false);
            }
        };

        fetchSlots();
    }, [form.medecin_id, form.date]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            if (!form.slot) {
                setError("Veuillez sélectionner un créneau.");
                setSaving(false);
                return;
            }

            if (!isFutureSlot(form.slot)) {
                setError("Veuillez choisir un créneau futur.");
                setSaving(false);
                return;
            }

            const payload = {
                medecin_id: form.medecin_id,
                date_heure: form.slot,
                motif: form.motif,
                notes: form.notes,
            };

            if (isEdit) {
                await updateRendezVousService(id, payload);
            } else {
                await createRendezVousService(payload);
            }

            navigate("/patient/rendezvous");
        } catch (err) {
            setError(parseError(err, "Impossible d'enregistrer le rendez-vous."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner text="Chargement du formulaire..." />;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        {isEdit ? "Modifier rendez-vous" : "Nouveau rendez-vous"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Choisissez un médecin, une date et un créneau disponible.
                    </p>
                </div>
                <Link
                    to="/patient/rendezvous"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                    Retour
                </Link>
            </div>

            {error ? (
                <div className="rounded-2xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm text-slate-600">Médecin</label>
                    <select
                        value={form.medecin_id}
                        onChange={(e) => setForm({ ...form, medecin_id: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">Sélectionner un médecin</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                Dr {doctor.user?.name || doctor.name || `#${doctor.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm text-slate-600">Date</label>
                    <input
                        type="date"
                        value={form.date}
                        min={today}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm text-slate-600">Heure</label>
                    <select
                        value={form.slot}
                        onChange={(e) => setForm({ ...form, slot: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">Sélectionner</option>
                        {visibleSlots.map((slot) => {
                            const slotValue = typeof slot === "string" ? slot : slot?.date_heure || slot?.value || "";
                            const slotLabel = typeof slot === "string"
                                ? slot
                                : slot?.label || slot?.time || slot?.date_heure || slot?.value || "";

                            return (
                            <option key={slotValue || slotLabel} value={slotValue}>
                                {slotLabel}
                            </option>
                            );
                        })}
                    </select>
                    {slotsLoading ? (
                        <p className="mt-1 text-xs text-slate-500">Chargement des créneaux...</p>
                    ) : null}
                </div>
                <div>
                    <label className="mb-1 block text-sm text-slate-600">Motif</label>
                    <input
                        value={form.motif}
                        onChange={(e) => setForm({ ...form, motif: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm text-slate-600">Notes</label>
                    <textarea
                        rows={4}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    {form.date && visibleSlots.length === 0 ? (
                        <p className="mt-2 text-xs text-slate-500">
                            Aucun créneau futur disponible pour cette date.
                        </p>
                    ) : null}
                </form>
    );
}
