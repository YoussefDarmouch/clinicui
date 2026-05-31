import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { ConsultationService } from "../services/medecin.services";
import { parseError, resolveData } from "../pages/page.utils";

export default function ConsultationDetails() {
    const { id } = useParams();
    const [consultation, setConsultation] = useState(null);
    const [dossier, setDossier] = useState(null);
    const [ordonnanceForm, setOrdonnanceForm] = useState(() => {
        const defaultValidUntil = new Date();
        defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);

        return {
            instructions: "",
            valid_until: defaultValidUntil.toISOString().slice(0, 10),
        };
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const handleCreateOrdonnance = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            await ConsultationService.createOrdonnance(id, ordonnanceForm);
            setSuccess("Ordonnance créée avec succès.");
            const defaultValidUntil = new Date();
            defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);
            setOrdonnanceForm({
                instructions: "",
                valid_until: defaultValidUntil.toISOString().slice(0, 10),
            });
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
                <h2 className="text-lg font-semibold text-slate-900">Créer une ordonnance depuis la consultation</h2>
                <label className="mt-4 block text-sm text-slate-600">Valide jusqu’au</label>
                <input
                    type="date"
                    value={ordonnanceForm.valid_until}
                    onChange={(e) => setOrdonnanceForm({ ...ordonnanceForm, valid_until: e.target.value })}
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
                <button
                    type="submit"
                    disabled={saving}
                    className="mt-4 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {saving ? "Création..." : "Créer ordonnance"}
                </button>
            </form>
        </div>
    );
}
