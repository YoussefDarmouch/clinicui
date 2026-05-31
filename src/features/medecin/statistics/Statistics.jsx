import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import StatsCard from "../components/StatsCard";
import { MedecinStatisticsService } from "../services/medecin.services";
import { parseError, resolveData } from "../pages/page.utils";

const toSeries = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    return [];
};

export default function Statistics() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await MedecinStatisticsService.getAll();
                setStats(resolveData(response) || {});
            } catch (err) {
                setError(parseError(err, "Impossible de charger les statistiques."));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const consultationsByMonth = useMemo(
        () => toSeries(stats.consultations_by_month || stats.monthly_consultations),
        [stats]
    );
    const rendezvousByStatus = useMemo(
        () => toSeries(stats.rendezvous_by_status || stats.status_breakdown),
        [stats]
    );
    const patientsActivity = useMemo(
        () => toSeries(stats.patients_activity || stats.patient_activity),
        [stats]
    );
    const maxMonthly = Math.max(
        ...consultationsByMonth.map((item) => Number(item.count || item.value || 0)),
        1
    );

    if (loading) return <LoadingSpinner text="Chargement des statistiques..." />;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Statistiques</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Analyse des consultations, rendez-vous et activité patient.
                </p>
                {error ? <p className="mt-2 text-sm text-primary-700">{error}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatsCard label="Consultations" value={stats.total_consultations || 0} />
                <StatsCard label="Rendez-vous" value={stats.total_rendezvous || 0} />
                <StatsCard label="Patients actifs" value={stats.total_active_patients || 0} />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Consultations par mois</h2>
                <div className="mt-5 flex h-44 items-end gap-2">
                    {consultationsByMonth.length === 0 ? (
                        <p className="text-sm text-slate-500">Aucune donnée disponible.</p>
                    ) : (
                        consultationsByMonth.map((item, index) => {
                            const count = Number(item.count || item.value || 0);
                            const height = Math.max(12, (count / maxMonthly) * 100);
                            return (
                                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-lg bg-primary-500"
                                        style={{ height: `${height}%` }}
                                        title={`${item.label || item.month || index}: ${count}`}
                                    />
                                    <span className="text-xs text-slate-500">
                                        {item.label || item.month || `M${index + 1}`}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Rendez-vous par statut</h2>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        {rendezvousByStatus.length === 0 ? (
                            <li>Aucune donnée disponible.</li>
                        ) : (
                            rendezvousByStatus.map((item, index) => (
                                <li key={index} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2">
                                    <span>{item.label || item.status || "Statut"}</span>
                                    <span className="font-semibold">{item.count || item.value || 0}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Activité patients</h2>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        {patientsActivity.length === 0 ? (
                            <li>Aucune donnée disponible.</li>
                        ) : (
                            patientsActivity.map((item, index) => (
                                <li key={index} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2">
                                    <span>{item.label || item.month || `Période ${index + 1}`}</span>
                                    <span className="font-semibold">{item.count || item.value || 0}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
