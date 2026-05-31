import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import { MedecinProfileService } from "../services/medecin.services";
import { parseError, resolveData } from "../pages/page.utils";

export default function Profile() {
    const { isAuthenticated, role, user } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fallbackProfile = useMemo(() => {
        const baseUser = user || {};
        const medecin = baseUser.medecin || baseUser.profile || {};

        return {
            ...baseUser,
            ...medecin,
            user: {
                ...(baseUser.user || {}),
                name: baseUser.name || baseUser.user?.name || "",
                email: baseUser.email || baseUser.user?.email || "",
                phone: baseUser.phone || baseUser.user?.phone || "",
                address: baseUser.address || baseUser.user?.address || "",
                is_active:
                    baseUser.is_active ?? baseUser.user?.is_active ?? true,
                id: baseUser.id || baseUser.user?.id || "",
            },
            specialite: medecin.specialite || baseUser.specialite || null,
            image_medecin: medecin.image_medecin || baseUser.image_medecin || null,
            numero_licence: medecin.numero_licence || baseUser.numero_licence || "—",
            annees_experience:
                medecin.annees_experience ?? baseUser.annees_experience ?? "—",
        };
    }, [user]);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await MedecinProfileService.get();
                const payload = resolveData(response) || {};
                const mergedProfile = {
                    ...fallbackProfile,
                    ...payload,
                    user: {
                        ...(fallbackProfile.user || {}),
                        ...(payload.user || {}),
                    },
                    specialite: payload.specialite || payload.medecin?.specialite || fallbackProfile.specialite || null,
                    image_medecin: payload.image_medecin || fallbackProfile.image_medecin || null,
                    numero_licence: payload.numero_licence || fallbackProfile.numero_licence || "—",
                    annees_experience:
                        payload.annees_experience ?? fallbackProfile.annees_experience ?? "—",
                };

                setProfile(mergedProfile);
            } catch (err) {
                setProfile(fallbackProfile);
                setError(parseError(err, "Impossible de charger le profil."));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [fallbackProfile]);

    if (!isAuthenticated || String(role || "").toLowerCase() !== "medecin") {
        return (
            <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">
                Accès refusé.
            </div>
        );
    }

    if (loading) return <LoadingSpinner text="Chargement du profil..." />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        {profile.user?.name || "Médecin"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Profil détaillé du médecin
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <span className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
                        Profil lecture seule
                    </span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex justify-center -mt-12">
                        <img
                            src={
                                profile.image_medecin
                                    ? `http://127.0.0.1:8000/${profile.image_medecin}`
                                    : "/default-doctor.png"
                            }
                            alt={profile.user?.name}
                            className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                        />
                    </div>

                    <div className="space-y-5">
                        <div>
                            <p className="text-sm text-slate-500">Nom</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">
                                {profile.user?.name || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Email</p>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {profile.user?.email || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Licence</p>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {profile.numero_licence || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Spécialité</p>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {profile.specialite?.name ||
                                    profile.specialite?.nom ||
                                    profile.specialite?.label ||
                                    "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Années d’expérience</p>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {profile.annees_experience ?? "—"} ans
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Statut</p>
                            <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${profile.user?.is_active
                                        ? "bg-primary-100 text-primary-700"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                {profile.user?.is_active ? "Actif" : "Inactif"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Informations de compte
                        </h2>
                        <div className="mt-6 grid gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Identifiant utilisateur</p>
                                <p className="mt-2 text-base font-medium text-slate-900">
                                    {profile.user?.id || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Téléphone</p>
                                <p className="mt-2 text-base font-medium text-slate-900">
                                    {profile.user?.phone || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Adresse</p>
                                <p className="mt-2 text-base font-medium text-slate-900">
                                    {profile.user?.address || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Résumé
                        </h2>
                        <p className="mt-4 text-sm text-slate-600">
                            Ce profil reprend les informations du médecin connectée depuis
                            la session utilisateur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
