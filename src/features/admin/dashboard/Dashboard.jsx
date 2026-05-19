import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserStatsService, getDashboardStatsService } from "../services/admin.service";

const summaryCards = [
    { label: 'Admins', valueKey: 'total_admins', accent: 'from-sky-500 to-sky-600' },
    { label: 'Médecins', valueKey: 'total_medecins', accent: 'from-emerald-500 to-emerald-600' },
    { label: 'Patients', valueKey: 'total_patients', accent: 'from-violet-500 to-violet-600' },
    { label: 'Consultations', valueKey: 'total_consultations', accent: 'from-rose-500 to-rose-600' },
    { label: 'Rendez-vous', valueKey: 'total_rendezvous', accent: 'from-amber-500 to-amber-600' },
];

export default function Dashboard() {
    const [userStats, setUserStats] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUserStatsService();
                const dashboard = await getDashboardStatsService();
                setUserStats(users.data);
                setDashboardStats(dashboard.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Chargement du tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.8)] text-white backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Vue d’ensemble</p>
                        <h1 className="mt-3 text-3xl font-semibold">Tableau de bord clinique</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-300">
                            Surveillez les indicateurs clés de la clinique et suivez l’activité utilisateur en un coup d’œil.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/" className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                                Accueil
                            </Link>
                            <Link to="/admin/profile" className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400">
                                Profil
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-white/10 px-5 py-4 text-slate-200 ring-1 ring-white/10">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Statut</p>
                        <p className="mt-2 text-xl font-semibold">Stable</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                {summaryCards.map((card) => (
                    <div
                        key={card.valueKey}
                        className={`rounded-[1.75rem] bg-gradient-to-br ${card.accent} p-6 text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-1 hover:shadow-xl`}
                    >
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-100/80">{card.label}</p>
                        <p className="mt-5 text-4xl font-semibold">
                            {dashboardStats?.[card.valueKey] ?? 0}
                        </p>
                        <p className="mt-3 text-sm text-slate-100/80">Comparaison du mois précédent</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Consultations (6 derniers mois)</h2>
                            <p className="mt-2 text-sm text-slate-500">Évolution des consultations récentes.</p>
                        </div>
                        <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                            6 derniers mois
                        </button>
                    </div>

                    <div className="mt-6">
                        <div className="flex h-52 items-end gap-3">
                            {[380, 450, 520, 600, 660, 740].map((value, index) => (
                                <div key={index} className="relative flex-1">
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200"></div>
                                    <div
                                        className="mx-auto h-full w-full rounded-xl bg-gradient-to-t from-sky-600 via-sky-400 to-sky-300"
                                        style={{ height: `${Math.max(20, Math.min(100, value / 10))}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 grid grid-cols-6 gap-2 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                            {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((month) => (
                                <span key={month}>{month}</span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Répartition des consultations</h2>
                            <p className="mt-2 text-sm text-slate-500">Top spécialités actives.</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500">Total</div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative h-40 w-40">
                            <div className="absolute inset-0 rounded-full bg-slate-100" />
                            <div className="absolute inset-0 rounded-full border-8 border-sky-500/40" />
                            <div className="absolute inset-x-10 inset-y-10 rounded-full bg-white" />
                            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 shadow-inner">
                                <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-900">2,845</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Cardiologie', color: 'bg-sky-500', value: '32%' },
                                { label: 'Dermatologie', color: 'bg-emerald-500', value: '21%' },
                                { label: 'Pédiatrie', color: 'bg-amber-400', value: '18%' },
                                { label: 'Gynécologie', color: 'bg-violet-500', value: '15%' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <span className={`${item.color} h-3.5 w-3.5 rounded-full`} />
                                    <span className="flex-1 text-sm text-slate-600">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Consultations récentes</h2>
                            <p className="mt-2 text-sm text-slate-500">Dernières consultations enregistrées.</p>
                        </div>
                        <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                            Voir tout
                        </button>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="py-3 font-medium">Patient</th>
                                    <th className="py-3 font-medium">Médecin</th>
                                    <th className="py-3 font-medium">Spécialité</th>
                                    <th className="py-3 font-medium">Date</th>
                                    <th className="py-3 font-medium">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { patient: 'Amine M.', doctor: 'Dr. Sara Benali', speciality: 'Cardiologie', date: '12/06/2025', status: 'Terminée', badge: 'bg-emerald-100 text-emerald-700' },
                                    { patient: 'Sarah L.', doctor: 'Dr. Youssef A.', speciality: 'Dermatologie', date: '12/06/2025', status: 'En cours', badge: 'bg-sky-100 text-sky-700' },
                                    { patient: 'Khalid B.', doctor: 'Dr. Nadia El M.', speciality: 'Pédiatrie', date: '11/06/2025', status: 'Terminée', badge: 'bg-emerald-100 text-emerald-700' },
                                    { patient: 'Fatima M.', doctor: 'Dr. Ahmed K.', speciality: 'Gynécologie', date: '11/06/2025', status: 'En attente', badge: 'bg-amber-100 text-amber-700' },
                                ].map((item, idx) => (
                                    <tr key={idx} className="bg-white">
                                        <td className="py-4 font-semibold text-slate-900">{item.patient}</td>
                                        <td className="py-4">{item.doctor}</td>
                                        <td className="py-4">{item.speciality}</td>
                                        <td className="py-4">{item.date}</td>
                                        <td className="py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.badge}`}>{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Activités récentes</h2>
                        <p className="mt-2 text-sm text-slate-500">Dernières actions du tableau de bord.</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        {[
                            { title: 'Nouveau patient inscrit', description: 'Amine M. a été ajouté par Dr. Sara Benali', time: 'Il y a 5 min', color: 'bg-emerald-100 text-emerald-700' },
                            { title: 'Rendez-vous créé', description: 'Nouveau rendez-vous le 15/06/2025 à 10:00', time: 'Il y a 20 min', color: 'bg-sky-100 text-sky-700' },
                            { title: 'Ordonnance ajoutée', description: 'Ordonnance pour Sarah L.', time: 'Il y a 1 heure', color: 'bg-amber-100 text-amber-700' },
                            { title: 'Nouvel utilisateur', description: 'Dr. Mohamed Ali a rejoint la plateforme', time: 'Il y a 2 heures', color: 'bg-violet-100 text-violet-700' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                <span className={`${item.color} inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold`}>•</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{item.title}</p>
                                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                                </div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.time}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
