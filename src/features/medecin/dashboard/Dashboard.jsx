import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { MedecinDashboardService } from "../services/medecin.services";
import { parseError, resolveArray, resolveData } from "../pages/page.utils";

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const [todayConsultations, setTodayConsultations] = useState([]);
    const [upcomingRendezvous, setUpcomingRendezvous] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            setError("");
            try {
                const [statsRes, todayRes, upcomingRes] = await Promise.all([
                    MedecinDashboardService.getStats(),
                    MedecinDashboardService.getTodayConsultations(),
                    MedecinDashboardService.getUpcoming(),
                ]);
                setStats(resolveData(statsRes) || {});
                setTodayConsultations(resolveArray(todayRes));
                setUpcomingRendezvous(resolveArray(upcomingRes));
            } catch (err) {
                setError(parseError(err, "Impossible de charger le dashboard."));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    console.log("STATS:", stats);
    if (loading) return <LoadingSpinner text="Chargement du dashboard médecin..." />;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Espace médecin
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Dashboard</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Vue globale des consultations et rendez-vous du jour.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/medecin/rendezvous"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                            Rendez-vous
                        </Link>
                        <Link
                            to="/medecin/consultations"
                            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Consultations
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

                <StatsCard
                    label="Rendez-vous à venir"
                    value={
                        Array.isArray(stats.upcoming_rendezvous)
                            ? stats.upcoming_rendezvous.length
                            : stats.upcoming_rendezvous ?? upcomingRendezvous.length
                    }
                />
                <StatsCard
                    label="Consultations aujourd'hui"
                    value={stats.today_count ?? todayConsultations.length}
                />

                <StatsCard
                    label="Patients suivis"
                    value={stats.patients_count ?? 0}
                />
            </div>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Consultations du jour</h2>
                {todayConsultations.length === 0 ? (
                    <EmptyState
                        title="Aucune consultation aujourd'hui"
                        description="Aucune consultation enregistrée pour la journée."
                    />
                ) : (
                    <DataTable
                        columns={[
                            { key: "patient", label: "Patient", render: (row) => row.patient?.name || row.patient_name || "—" },
                            { key: "diagnostic", label: "Diagnostic" },
                            {
                                key: "date",
                                label: "Date",
                                render: (row) =>
                                    row.date_consultation
                                        ? new Date(row.date_consultation).toLocaleString("fr-FR")
                                        : "—",
                            },
                        ]}
                        rows={todayConsultations}
                    />
                )}
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Rendez-vous à venir</h2>
                {upcomingRendezvous.length === 0 ? (
                    <EmptyState
                        title="Aucun rendez-vous à venir"
                        description="Aucun rendez-vous planifié pour les prochaines heures."
                    />
                ) : (
                    <DataTable
                        columns={[
                            { key: "patient", label: "Patient", render: (row) => row.patient?.name || row.patient_name || "—" },
                            {
                                key: "date_heure",
                                label: "Date/heure",
                                render: (row) =>
                                    row.date_heure ? new Date(row.date_heure).toLocaleString("fr-FR") : "—",
                            },
                            { key: "statut", label: "Statut", render: (row) => row.statut || row.status || "—" },
                        ]}
                        rows={upcomingRendezvous}
                    />
                )}
            </section>
        </div>
    );
}
