import { useEffect, useState } from "react";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import { getStatisticsService } from "../../services/patient.services";
import { parseError, resolveData } from "../page.utils";

export default function Statistics() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getStatisticsService();
                setStats(resolveData(response) || {});
            } catch (err) {
                setError(parseError(err, "Impossible de charger les statistiques."));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner text="Chargement des statistiques..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Statistiques</h1>
                <p className="mt-2 text-sm text-slate-500">Vue d'ensemble de votre activité médicale.</p>
            </div>

            {error ? (
                <div className="rounded-2xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Rendez-vous</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total_rendezvous ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Consultations</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total_consultations ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Ordonnances</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total_ordonnances ?? 0}</p>
                </div>
            </div>
        </div>
    );
}
