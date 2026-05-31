import { useEffect, useState } from "react";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getProfileService, updateProfileService, uploadAvatarService } from "../../services/patient.services";
import { parseError, resolveData } from "../page.utils";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await getProfileService();
                const payload = resolveData(response);
                setProfile(payload);
                setForm({
                    name: payload?.user?.name || payload?.name || "",
                    email: payload?.user?.email || payload?.email || "",
                    phone: payload?.user?.phone || payload?.phone || "",
                    address: payload?.user?.address || payload?.address || "",
                });
            } catch (err) {
                setError(parseError(err, "Impossible de charger le profil."));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            await updateProfileService(form);
            setSuccess("Profil mis à jour.");
        } catch (err) {
            setError(parseError(err, "Mise à jour impossible."));
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            await uploadAvatarService(formData);
            setSuccess("Avatar mis à jour.");
        } catch (err) {
            setError(parseError(err, "Upload avatar impossible."));
        }
    };

    if (loading) return <LoadingSpinner text="Chargement du profil..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Mon profil</h1>
                <p className="mt-2 text-sm text-slate-500">Informations personnelles et photo de profil.</p>
            </div>

            {error ? <div className="rounded-2xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">{error}</div> : null}
            {success ? <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">{success}</div> : null}

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <input type="file" onChange={handleAvatarChange} className="block w-full text-sm text-slate-600" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Nom" />
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Email" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Téléphone" />
                    <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Adresse" />
                </div>
                <button type="submit" disabled={saving} className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
            </form>
        </div>
    );
}
