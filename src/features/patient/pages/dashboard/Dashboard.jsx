import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../medecin/components/LoadingSpinner";
import EmptyState from "../../../medecin/components/EmptyState";
import { getStatisticsService } from "../../services/patient.services";
import { parseError, resolveData } from "../page.utils";

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getStatisticsService();
                setStats(resolveData(response) || {});
            } catch (err) {
                setError(parseError(err, "Impossible de charger le dashboard patient."));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <LoadingSpinner text="Chargement du dashboard patient..." />;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Espace patient
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Dashboard</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Vue globale de vos rendez-vous, consultations et ordonnances.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/patient/rendezvous/new"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                            Nouveau rendez-vous
                        </Link>
                        <Link
                            to="/patient/dossier-medical"
                            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Mon dossier
                        </Link>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-3xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Rendez-vous</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {stats.total_rendezvous ?? 0}
                    </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Consultations</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {stats.total_consultations ?? 0}
                    </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Ordonnances</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {stats.total_ordonnances ?? 0}
                    </p>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Activité récente</h2>
                <EmptyState
                    title="Section dashboard prête"
                    description="Ajoutez ici vos tableaux récents si l'API retourne des listes détaillées."
                />
            </div>
        </div>
    );
}
