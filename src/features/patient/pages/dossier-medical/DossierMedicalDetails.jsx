import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getDossierByIdService, updateDossierMedicalService } from "../../services/patient.services";
import { parseError, resolveData } from "../page.utils";

export default function DossierMedicalDetails() {
    const { id } = useParams();
    const [dossier, setDossier] = useState(null);
    const [form, setForm] = useState({ notes: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchDossier = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getDossierByIdService(id);
                const payload = resolveData(response);
                setDossier(payload);
                setForm({ notes: payload?.notes || payload?.observations || "" });
            } catch (err) {
                setError(parseError(err, "Impossible de charger le dossier médical."));
            } finally {
                setLoading(false);
            }
        };

        fetchDossier();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const response = await updateDossierMedicalService(form);
            setDossier(resolveData(response) || dossier);
            setSuccess("Dossier médical mis à jour.");
        } catch (err) {
            setError(parseError(err, "Mise à jour impossible."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner text="Chargement du dossier médical..." />;

    if (!dossier) {
        return <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">Dossier introuvable.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Dossier médical #{dossier.id || id}</h1>
                        <p className="mt-2 text-sm text-slate-500">Vue détaillée de votre dossier médical.</p>
                    </div>
                    <Link
                        to="/patient/dossier-medical"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                        Retour
                    </Link>
                </div>
                {error ? <p className="mt-3 text-sm text-primary-700">{error}</p> : null}
                {success ? <p className="mt-2 text-sm text-primary-700">{success}</p> : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Résumé</h2>
                <pre className="mt-3 max-h-44 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    {JSON.stringify(dossier || {}, null, 2)}
                </pre>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Mettre à jour</h2>
                <label className="mt-4 block text-sm text-slate-600">Notes / observations</label>
                <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ notes: e.target.value })}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                    type="submit"
                    disabled={saving}
                    className="mt-4 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
            </form>
        </div>
    );
}
