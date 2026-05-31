import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { ConsultationService, RendezVousService } from "../services/medecin.services";
import { parseError, resolveData } from "../pages/page.utils";

const initialForm = {
    patient_id: "",
    patient_name: "",
    rendezvous_id: "",
    date_consultation: "",
    poids: "",
    tension: "",
    temperature: "",
    diagnostic: "",
    traitement: "",
    notes: "",
};

const resolveNestedId = (...values) =>
    values.find((value) => value !== undefined && value !== null && value !== "") || "";

export default function ConsultationForm() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isEdit = useMemo(() => Boolean(id), [id]);
    const rdvId = useMemo(() => new URLSearchParams(location.search).get("rdv_id"), [location.search]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(isEdit || Boolean(rdvId));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEdit) return;

        const fetchDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await ConsultationService.getById(id);
                const payload = resolveData(response) || {};
                setForm({
                    patient_id: resolveNestedId(
                        payload.patient_id,
                        payload.patient?.id,
                        payload.patient?.patient_id,
                        payload.patient?.user_id,
                        payload.patient?.user?.id
                    ),
                    patient_name: payload.patient?.user?.name || payload.patient?.name || "",
                    rendezvous_id: resolveNestedId(
                        payload.rendezvous_id,
                        payload.rendezvous?.id,
                        payload.rdv_id,
                        payload.rendezvous?.rendezvous_id
                    ),
                    date_consultation: payload.date_consultation || "",
                    poids: payload.poids || "",
                    tension: payload.tension || "",
                    temperature: payload.temperature || "",
                    diagnostic: payload.diagnostic || "",
                    traitement: payload.traitement || "",
                    notes: payload.notes || payload.details?.notes || "",
                });
            } catch (err) {
                setError(parseError(err, "Impossible de charger la consultation."));
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, isEdit]);

    useEffect(() => {
        if (isEdit || !rdvId) return;

        const fetchRendezVous = async () => {
            setLoading(true);
            setError("");
            try {
                const [rdvResponse, patientResponse] = await Promise.all([
                    RendezVousService.getById(rdvId),
                    RendezVousService.getPatient(rdvId),
                ]);
                const payload = resolveData(rdvResponse) || {};
                const patientPayload = resolveData(patientResponse) || {};
                setForm((prev) => ({
                    ...prev,
                    rendezvous_id: resolveNestedId(
                        payload.id,
                        payload.rendezvous_id,
                        payload.rdv_id,
                        rdvId
                    ),
                    patient_id: resolveNestedId(
                        payload.patient_id,
                        patientPayload.id,
                        patientPayload.patient_id,
                        payload.patient?.id,
                        payload.patient?.patient_id,
                        payload.patient?.user_id,
                        payload.patient?.user?.id,
                        prev.patient_id
                    ),
                    patient_name:
                        patientPayload.user?.name ||
                        patientPayload.name ||
                        payload.patient?.user?.name ||
                        payload.patient?.name ||
                        prev.patient_name,
                }));
            } catch (err) {
                setError(parseError(err, "Impossible de charger le rendez-vous confirmé."));
            } finally {
                setLoading(false);
            }
        };

        fetchRendezVous();
    }, [rdvId, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            if (isEdit) {
                await ConsultationService.update(id, form);
            } else {
                await ConsultationService.create(form);
            }
            navigate("/medecin/consultations");
        } catch (err) {
            setError(parseError(err, "Enregistrement impossible."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner text="Chargement du formulaire..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">
                    {isEdit ? "Modifier consultation" : "Nouvelle consultation"}
                </h1>
                {isEdit ? <p className="mt-2 text-sm text-slate-500">Consultation ID: {id}</p> : null}
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Patient</label>
                        <input
                            value={form.patient_name}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
                            readOnly
                            placeholder="Patient lié au rendez-vous"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Patient ID</label>
                        <input
                            value={form.patient_id}
                            onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Rendez-vous ID</label>
                        <input
                            value={form.rendezvous_id}
                            onChange={(e) => setForm({ ...form, rendezvous_id: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            readOnly={Boolean(rdvId)}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Date consultation</label>
                        <input
                            type="datetime-local"
                            value={form.date_consultation}
                            onChange={(e) => setForm({ ...form, date_consultation: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Poids</label>
                        <input
                            type="text"
                            value={form.poids}
                            onChange={(e) => setForm({ ...form, poids: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Ex: 72 kg"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Tension</label>
                        <input
                            type="text"
                            value={form.tension}
                            onChange={(e) => setForm({ ...form, tension: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Ex: 12/8"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Température</label>
                        <input
                            type="text"
                            value={form.temperature}
                            onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Ex: 37.2 °C"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Diagnostic</label>
                        <input
                            value={form.diagnostic}
                            onChange={(e) => setForm({ ...form, diagnostic: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm text-slate-600">Traitement</label>
                        <textarea
                            value={form.traitement}
                            onChange={(e) => setForm({ ...form, traitement: e.target.value })}
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm text-slate-600">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {error ? <p className="mt-4 text-sm text-primary-700">{error}</p> : null}

                <div className="mt-6 flex flex-wrap gap-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    <Link
                        to="/medecin/consultations"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                        Annuler
                    </Link>
                </div>
            </form>
        </div>
    );
}
