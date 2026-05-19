import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getDashboardStatsService,
    getUserStatsService,
    getConsultationStatsService,
    getRecentConsultationsService,
    getConsultationsByMonthService,
    getConsultationsBySpecialityService,
    getRecentActivitiesService,
    getTodayStatsService,
    getPendingRendezvousService,
} from "../services/admin.service";

const summaryCards = [
    { label: 'Admins', valueKey: 'total_admins', accent: 'from-primary-500 to-primary-600' },
    { label: 'Médecins', valueKey: 'total_medecins', accent: 'from-primary-500 to-primary-600' },
    { label: 'Patients', valueKey: 'total_patients', accent: 'from-primary-500 to-primary-600' },
    { label: 'Consultations', valueKey: 'total_consultations', accent: 'from-primary-500 to-primary-600' },
    { label: 'Rendez-vous', valueKey: 'total_rendezvous', accent: 'from-primary-500 to-primary-600' },
];

const normalizeValue = (value) => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizeObject = (value) => value?.data ?? value;

const asArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (Array.isArray(value.data)) return value.data;
    if (Array.isArray(value.items)) return value.items;
    if (Array.isArray(value.results)) return value.results;
    if (Array.isArray(value.months)) return value.months;
    if (Array.isArray(value.labels) && Array.isArray(value.values)) {
        return value.labels.map((label, index) => ({ month: label, value: value.values[index] ?? 0 }));
    }
    // handle numeric-keyed objects like monthly_activity: {"5": {label: 'May', count: 8}, ...}
    if (typeof value === 'object') {
        const keys = Object.keys(value).filter(k => !isNaN(Number(k)));
        if (keys.length > 0) {
            return keys
                .sort((a, b) => Number(a) - Number(b))
                .map((k) => {
                    const v = value[k];
                    if (v && (v.label || v.count !== undefined || v.value !== undefined)) {
                        return { month: v.label ?? k, value: v.count ?? v.value ?? 0 };
                    }
                    return { month: k, value: typeof v === 'number' ? v : (v?.count ?? v?.value ?? 0) };
                });
        }

        // fallback: object with keyed entries like { data: [...] }
        if (value.data && Array.isArray(value.data)) return value.data;
    }

    return [];
};

const getLabel = (item, defaultLabel = '?') => {
    return (
        item?.speciality ?? item?.specialite ?? item?.name ?? item?.label ?? item?.user?.name ?? defaultLabel
    );
};

const getMonthLabel = (item, index) => {
    return item?.month ?? item?.label ?? item?.name ?? `Mois ${index + 1}`;
};

const getNumeric = (item) => normalizeValue(item?.count ?? item?.total ?? item?.value ?? item?.y ?? item?.consultations ?? item?.amount ?? item?.count_value);

const formatTimestamp = (item) => {
    const t = item?.time ?? item?.occurred_at ?? item?.occurredAt ?? item?.created_at ?? item?.updated_at ?? item?.date ?? item;
    if (!t) return 'Il y a peu';
    try {
        return new Date(t).toLocaleString('fr-FR');
    } catch (e) {
        return String(t);
    }
};

const stringifyName = (v) => {
    if (v === undefined || v === null) return '?';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (typeof v === 'object') {
        return (
            v.patient_name ?? v.name ?? v.full_name ?? v.label ?? v.user?.name ?? v.user?.full_name ?? v.user?.username ?? '?'
        );
    }
    return '?';
};

export default function Dashboard() {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [consultationStats, setConsultationStats] = useState(null);
    const [recentConsultations, setRecentConsultations] = useState([]);
    const [consultationsByMonth, setConsultationsByMonth] = useState([]);
    const [consultationsBySpeciality, setConsultationsBySpeciality] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [todayStats, setTodayStats] = useState(null);
    const [pendingRendezvous, setPendingRendezvous] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashboard, users, consultation, recent, monthly, speciality, activities, today, pending] = await Promise.all([
                    getDashboardStatsService(),
                    getUserStatsService(),
                    getConsultationStatsService(),
                    getRecentConsultationsService(),
                    getConsultationsByMonthService(),
                    getConsultationsBySpecialityService(),
                    getRecentActivitiesService(),
                    getTodayStatsService(),
                    getPendingRendezvousService(),
                ]);

                setDashboardStats(normalizeObject(dashboard));
                setUserStats(normalizeObject(users));
                setConsultationStats(normalizeObject(consultation));
                setRecentConsultations(normalizeObject(recent));
                setConsultationsByMonth(normalizeObject(monthly));
                setConsultationsBySpeciality(normalizeObject(speciality));
                setRecentActivities(normalizeObject(activities));
                setTodayStats(normalizeObject(today));
                setPendingRendezvous(normalizeObject(pending));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // prefer nested keys used in dashboard response (recent_rendezvous)
    const recentConsultationRows = asArray(recentConsultations?.recent_rendezvous ?? recentConsultations ?? dashboardStats?.recent_rendezvous ?? dashboardStats?.recent_consultations);
    const monthlyData = asArray(consultationsByMonth);
    const specialityData = asArray(consultationsBySpeciality);
    const activityRows = asArray(recentActivities);

    const monthValues = monthlyData.map(getNumeric);
    const maxMonthValue = Math.max(...monthValues, 1);

    const todayConsultations = normalizeValue(
        todayStats?.consultations_today ?? todayStats?.consultations ?? todayStats?.today_consultations ?? todayStats?.total ?? 0
    );
    let pendingCount = 0;
    if (Array.isArray(pendingRendezvous)) pendingCount = pendingRendezvous.length;
    else if (pendingRendezvous && Array.isArray(pendingRendezvous.data)) pendingCount = pendingRendezvous.data.length;
    else pendingCount = normalizeValue(pendingRendezvous?.pending ?? pendingRendezvous?.count ?? pendingRendezvous?.total ?? 0);
    const totalConsultations = normalizeValue(consultationStats?.total_consultations ?? consultationStats?.count ?? consultationStats?.total ?? 0);
    const totalUsers = normalizeValue(userStats?.total_users ?? userStats?.count ?? userStats?.users ?? 0);

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Chargement du tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-primary-50 px-6 py-6">
            <div className="rounded-[2rem] border border-primary-200 bg-white/90 p-6 shadow-sm text-slate-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-primary-700">Vue d'ensemble</p>
                        <h1 className="mt-3 text-3xl font-semibold">Tableau de bord clinique</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                            Surveillez les indicateurs clés de la clinique et suivez l'activité utilisateur en un coup d'œil.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/" className="inline-flex items-center rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-primary-100">
                                Accueil
                            </Link>
                            <Link to="/admin/profile" className="inline-flex items-center rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                                Profil
                            </Link>
                        </div>
                    </div>
                    <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-auto lg:grid-cols-1">
                        <div className="rounded-3xl bg-primary-50 px-5 py-4 text-slate-900 ring-1 ring-primary-200">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Consultations aujourd'hui</p>
                            <p className="mt-2 text-2xl font-semibold">{todayConsultations}</p>
                        </div>
                        <div className="rounded-3xl bg-primary-50 px-5 py-4 text-slate-900 ring-1 ring-primary-200">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rendez-vous en attente</p>
                            <p className="mt-2 text-2xl font-semibold">{pendingCount}</p>
                        </div>
                        <div className="rounded-3xl bg-primary-50 px-5 py-4 text-slate-900 ring-1 ring-primary-200">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Total consultations</p>
                            <p className="mt-2 text-2xl font-semibold">{totalConsultations}</p>
                        </div>
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
                            {normalizeValue(dashboardStats?.[card.valueKey] ?? dashboardStats?.data?.[card.valueKey] ?? 0)}
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
                            {monthlyData.length > 0 ? (
                                monthlyData.map((item, index) => {
                                    const value = getNumeric(item);
                                    const height = Math.max(20, Math.min(100, (value / maxMonthValue) * 100));

                                    return (
                                        <div key={index} className="relative flex-1">
                                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200"></div>
                                            <div
                                                className="mx-auto h-full w-full rounded-xl bg-gradient-to-t from-primary-600 via-primary-500 to-primary-500"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex h-52 items-center justify-center text-sm text-slate-400">Aucune donnée de consultation disponible.</div>
                            )}
                        </div>
                        <div className="mt-4 grid grid-cols-6 gap-2 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                            {monthlyData.length > 0 ? (
                                monthlyData.map((item, index) => (
                                    <span key={index}>{getMonthLabel(item, index)}</span>
                                ))
                            ) : (
                                <span className="col-span-6">Aucune période disponible</span>
                            )}
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
                            <div className="absolute inset-0 rounded-full border-8 border-primary-500/40" />
                            <div className="absolute inset-x-10 inset-y-10 rounded-full bg-white" />
                            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 shadow-inner">
                                <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-900">{normalizeValue(specialityData.reduce((acc, item) => acc + getNumeric(item), 0))}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {specialityData.length > 0 ? (
                                specialityData.slice(0, 4).map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className={`h-3.5 w-3.5 rounded-full ${['bg-primary-500', 'bg-primary-500', 'bg-primary-500', 'bg-primary-500'][index] ?? 'bg-slate-400'}`} />
                                        <span className="flex-1 text-sm text-slate-600">{getLabel(item)}</span>
                                        <span className="text-sm font-semibold text-slate-900">{normalizeValue(item?.percentage ?? item?.percent ?? item?.value ?? item?.count ?? 0)}%</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500">Aucune spécialité disponible pour le moment.</div>
                            )}
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
                                {recentConsultationRows.length > 0 ? (
                                    recentConsultationRows.map((item, idx) => {
                                        const rawPatient = item?.patient_name ?? item?.patient ?? item?.client ?? item?.patient_id ?? null;
                                        const rawDoctor = item?.doctor_name ?? item?.medecin ?? item?.doctor ?? item?.medecin_id ?? null;
                                        const rawSpeciality = item?.speciality ?? item?.specialite ?? item?.specialty ?? item?.medecin?.specialite ?? null;

                                        const patientName = stringifyName(rawPatient);
                                        const doctorName = stringifyName(rawDoctor);
                                        const speciality = stringifyName(rawSpeciality);

                                        const date = item?.date_heure ?? item?.date ?? item?.created_at ?? item?.scheduled_at ?? item?.date_time ?? null;
                                        const status = item?.statut ?? item?.status ?? item?.etat ?? item?.state ?? '?';

                                        const statusLower = String(status).toLowerCase();
                                        let badgeClass = 'bg-slate-100 text-slate-700';
                                        if (statusLower.includes('complete') || statusLower.includes('termin')) badgeClass = 'bg-primary-100 text-primary-700';
                                        if (statusLower.includes('planifi') || statusLower.includes('plan')) badgeClass = 'bg-primary-100 text-primary-700';
                                        if (statusLower.includes('annul') || statusLower.includes('cancel')) badgeClass = 'bg-primary-100 text-primary-700';

                                        return (
                                            <tr key={idx} className="bg-white">
                                                <td className="py-4 font-semibold text-slate-900">{patientName}</td>
                                                <td className="py-4">{doctorName}</td>
                                                <td className="py-4">{speciality}</td>
                                                <td className="py-4">{date ? new Date(date).toLocaleDateString('fr-FR') : '?'}</td>
                                                <td className="py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{status}</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                                            Aucune consultation récente disponible.
                                        </td>
                                    </tr>
                                )}
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
                        {activityRows.length > 0 ? (
                            activityRows.map((item, idx) => {
                                const title = item?.label ?? item?.title ?? item?.action ?? item?.type ?? 'Action récente';
                                const rawDetails = item?.details ?? item?.message ?? item?.description ?? null;
                                let description = typeof rawDetails === 'string' ? rawDetails : null;
                                if (!description && rawDetails) {
                                    description = stringifyName(rawDetails);
                                    if (description === '?') description = JSON.stringify(rawDetails);
                                }
                                description = description ?? 'Aucune description disponible.';
                                const time = formatTimestamp(item?.occurred_at ?? item?.occurredAt ?? item?.created_at ?? item?.time ?? item);
                                const isPositive = /ajout|créé|nouveau|nouvelle|new/i.test((title || '') + ' ' + (description || ''));
                                const color = isPositive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-700';

                                return (
                                    <div key={idx} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                        <span className={`${color} inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold`}>?</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{title}</p>
                                            <p className="mt-1 text-sm text-slate-500">{description}</p>
                                        </div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{time}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                                Aucune activité récente disponible.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}



