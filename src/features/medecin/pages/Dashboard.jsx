import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    getConsultationsService,
    getRendezVousService,
    getUpcomingRendezVousService,
    getTodayConsultationsService,
} from '../services/medecin.service'
import {
    buildMonthlySeries,
    countByStatus,
    formatDate,
    getStatusBadgeClass,
    normalizeNumber,
    normalizeString,
    toArray,
} from './page.utils'

const summaryCards = [
    { label: 'Consultations', key: 'consultations', accent: 'from-primary-500 to-primary-600' },
    { label: 'Rendez-vous', key: 'rendezvous', accent: 'from-primary-500 to-primary-600' },
    { label: 'Patients uniques', key: 'patients', accent: 'from-primary-500 to-primary-600' },
    { label: 'Rendez-vous en attente', key: 'pending', accent: 'from-primary-500 to-primary-600' },
]

export default function Dashboard() {
    const [consultations, setConsultations] = useState([])
    const [rendezvous, setRendezvous] = useState([])
    const [upcomingRendezvous, setUpcomingRendezvous] = useState([])
    const [todayConsultations, setTodayConsultations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            setError(null)

            try {
                const [consultationsRes, rendezvousRes, upcomingRes, todayRes] = await Promise.all([
                    getConsultationsService(),
                    getRendezVousService(),
                    getUpcomingRendezVousService(),
                    getTodayConsultationsService(),
                ])

                setConsultations(toArray(consultationsRes))
                setRendezvous(toArray(rendezvousRes))
                setUpcomingRendezvous(toArray(upcomingRes))
                setTodayConsultations(toArray(todayRes))
            } catch (err) {
                setError('Impossible de charger le tableau de bord médecin.')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const stats = useMemo(() => {
        const patientSet = new Set()
        consultations.forEach((item) => {
            const patientId =
                item?.patient_id ??
                item?.patient?.id ??
                item?.patient_name ??
                item?.patient?.name
            if (patientId) patientSet.add(String(patientId))
        })

        const pending = rendezvous.filter((item) => {
            const value = String(item?.statut ?? item?.status ?? item?.etat ?? '').toLowerCase()
            return value.includes('attente') || value.includes('pending') || value.includes('planifi')
        }).length

        const todayCount = todayConsultations.length > 0
            ? todayConsultations.length
            : consultations.filter((item) => {
                const date = item?.date_consultation ?? item?.created_at
                const current = new Date(date)
                const now = new Date()
                return (
                    !Number.isNaN(current.getTime()) &&
                    current.getDate() === now.getDate() &&
                    current.getMonth() === now.getMonth() &&
                    current.getFullYear() === now.getFullYear()
                )
            }).length

        return {
            consultations: consultations.length,
            rendezvous: rendezvous.length,
            patients: patientSet.size,
            pending,
            todayCount,
            upcomingCount: upcomingRendezvous.length,
        }
    }, [consultations, rendezvous, todayConsultations, upcomingRendezvous])

    const monthlyConsultations = useMemo(
        () => buildMonthlySeries(consultations, ['date_consultation', 'created_at', 'date'], 6),
        [consultations]
    )

    const rendezvousStatuses = useMemo(() => {
        const entries = Object.entries(countByStatus(rendezvous))
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
        return entries.slice(0, 4)
    }, [rendezvous])

    const recentConsultations = useMemo(() => {
        return [...consultations]
            .sort((a, b) => {
                const aDate = new Date(a?.date_consultation ?? a?.created_at ?? 0).getTime()
                const bDate = new Date(b?.date_consultation ?? b?.created_at ?? 0).getTime()
                return bDate - aDate
            })
            .slice(0, 5)
    }, [consultations])

    const nextRendezvous = useMemo(() => {
        const base = upcomingRendezvous.length > 0 ? upcomingRendezvous : rendezvous
        return [...base]
            .sort((a, b) => {
                const aDate = new Date(a?.date_heure ?? a?.scheduled_at ?? 0).getTime()
                const bDate = new Date(b?.date_heure ?? b?.scheduled_at ?? 0).getTime()
                return aDate - bDate
            })
            .slice(0, 5)
    }, [upcomingRendezvous, rendezvous])

    const maxMonthlyValue = Math.max(...monthlyConsultations.map((item) => item.value), 1)

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Chargement du tableau de bord médecin...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-primary-600">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 bg-primary-50 px-6 py-6">
            <div className="rounded-[2rem] border border-primary-200 bg-white/90 p-6 shadow-sm text-slate-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-primary-700">Espace médecin</p>
                        <h1 className="mt-3 text-3xl font-semibold">Tableau de bord clinique</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                            Suivez vos consultations, vos rendez-vous et l'activité patient en temps réel.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/"
                                className="inline-flex items-center rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-primary-100"
                            >
                                Accueil
                            </Link>
                            <button
                                type="button"
                                className="inline-flex items-center rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                            >
                                Actualiser
                            </button>
                        </div>
                    </div>

                    <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-auto lg:grid-cols-1">
                        <div className="rounded-3xl bg-primary-50 px-5 py-4 text-slate-900 ring-1 ring-primary-200">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Consultations aujourd'hui</p>
                            <p className="mt-2 text-2xl font-semibold">{stats.todayCount}</p>
                        </div>
                        <div className="rounded-3xl bg-primary-50 px-5 py-4 text-slate-900 ring-1 ring-primary-200">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rendez-vous à venir</p>
                            <p className="mt-2 text-2xl font-semibold">{stats.upcomingCount}</p>
                        </div>
                        <div className="rounded-3xl bg-primary-50 px-5 py-4 text-slate-900 ring-1 ring-primary-200">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Patients suivis</p>
                            <p className="mt-2 text-2xl font-semibold">{stats.patients}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                {summaryCards.map((card) => (
                    <div
                        key={card.key}
                        className={`rounded-[1.75rem] bg-gradient-to-br ${card.accent} p-6 text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-1 hover:shadow-xl`}
                    >
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-100/80">{card.label}</p>
                        <p className="mt-5 text-4xl font-semibold">{normalizeNumber(stats[card.key])}</p>
                        <p className="mt-3 text-sm text-slate-100/80">Indicateurs opérationnels</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Consultations (6 derniers mois)</h2>
                            <p className="mt-2 text-sm text-slate-500">Évolution de votre charge de consultations.</p>
                        </div>
                        <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                            6 derniers mois
                        </button>
                    </div>

                    <div className="mt-6">
                        <div className="flex h-52 items-end gap-3">
                            {monthlyConsultations.map((item) => {
                                const height = Math.max(20, Math.min(100, (item.value / maxMonthlyValue) * 100))
                                return (
                                    <div key={item.key} className="relative flex-1">
                                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200" />
                                        <div
                                            className="mx-auto h-full w-full rounded-xl bg-gradient-to-t from-primary-600 via-primary-500 to-primary-500"
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-4 grid grid-cols-6 gap-2 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                            {monthlyConsultations.map((item) => (
                                <span key={item.key}>{item.label}</span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Répartition des rendez-vous</h2>
                            <p className="mt-2 text-sm text-slate-500">Statuts les plus fréquents.</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500">Total</div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative h-40 w-40">
                            <div className="absolute inset-0 rounded-full bg-slate-100" />
                            <div className="absolute inset-0 rounded-full border-8 border-primary-500/40" />
                            <div className="absolute inset-x-10 inset-y-10 rounded-full bg-white" />
                            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 shadow-inner">
                                <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-900">
                                    {rendezvous.length}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {rendezvousStatuses.length > 0 ? (
                                rendezvousStatuses.map((item, index) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <span className={`${['bg-primary-500', 'bg-primary-500', 'bg-primary-500', 'bg-primary-500'][index] ?? 'bg-slate-400'} h-3.5 w-3.5 rounded-full`} />
                                        <span className="flex-1 text-sm capitalize text-slate-600">{item.label}</span>
                                        <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">Aucun rendez-vous disponible.</p>
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
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="py-3 font-medium">Patient</th>
                                    <th className="py-3 font-medium">Diagnostic</th>
                                    <th className="py-3 font-medium">Traitement</th>
                                    <th className="py-3 font-medium">Date</th>
                                    <th className="py-3 font-medium">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentConsultations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                                            Aucune consultation récente.
                                        </td>
                                    </tr>
                                ) : (
                                    recentConsultations.map((item) => (
                                        <tr key={item.id} className="bg-white">
                                            <td className="py-4 font-semibold text-slate-900">
                                                {normalizeString(item?.patient_name ?? item?.patient)}
                                            </td>
                                            <td className="py-4">{normalizeString(item?.diagnostic)}</td>
                                            <td className="py-4">{normalizeString(item?.traitement)}</td>
                                            <td className="py-4">{formatDate(item?.date_consultation ?? item?.created_at, true)}</td>
                                            <td className="py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(item?.statut ?? item?.status)}`}>
                                                    {normalizeString(item?.statut ?? item?.status, 'inconnu')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Rendez-vous à venir</h2>
                        <p className="mt-2 text-sm text-slate-500">Créneaux planifiés prochainement.</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        {nextRendezvous.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                                Aucun rendez-vous à venir.
                            </div>
                        ) : (
                            nextRendezvous.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${getStatusBadgeClass(item?.statut ?? item?.status)}`}>
                                        RDV
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">
                                            {normalizeString(item?.patient_name ?? item?.patient)}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">{normalizeString(item?.motif)}</p>
                                    </div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        {formatDate(item?.date_heure ?? item?.scheduled_at, true)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
