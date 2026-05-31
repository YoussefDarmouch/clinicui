import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { MedecinProfileService } from "../services/medecin.services";
import { parseError, resolveData } from "../pages/page.utils";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", adresse: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await MedecinProfileService.get();
                const payload = resolveData(response) || {};
                setProfile(payload);
                setForm({
                    name: payload.name || payload.user?.name || "",
                    email: payload.email || payload.user?.email || "",
                    phone: payload.phone || payload.user?.phone || "",
                    adresse: payload.adresse || "",
                });
            } catch (err) {
                setError(parseError(err, "Impossible de charger le profil."));
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            await MedecinProfileService.update(form);
            setSuccess("Profil mis à jour.");
        } catch (err) {
            setError(parseError(err, "Mise à jour impossible."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner text="Chargement du profil..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Profil médecin</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Informations personnelles et professionnelles.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Nom</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Téléphone</label>
                        <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Adresse</label>
                        <input
                            value={form.adresse}
                            onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {profile ? (
                    <p className="mt-4 text-xs text-slate-500">
                        Spécialité: {profile.specialite?.nom || profile.specialite || "Non renseignée"}
                    </p>
                ) : null}
                {error ? <p className="mt-2 text-sm text-primary-700">{error}</p> : null}
                {success ? <p className="mt-2 text-sm text-primary-700">{success}</p> : null}

                <button
                    type="submit"
                    disabled={saving}
                    className="mt-6 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
            </form>
        </div>
    );
}
