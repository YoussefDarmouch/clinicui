import { useEffect, useMemo, useState } from 'react'
import {
    getConsultationsService,
    getRendezVousService,
    getTodayConsultationsService,
} from '../services/medecin.service'
import {
    buildMonthlySeries,
    countByStatus,
    normalizeNumber,
    normalizeString,
    toArray,
} from './page.utils'

const statCards = [
    { label: 'Consultations totales', key: 'consultations', accent: 'from-primary-500 to-primary-600' },
    { label: 'Rendez-vous totaux', key: 'rendezvous', accent: 'from-primary-500 to-primary-600' },
    { label: 'Consultations aujourd’hui', key: 'today', accent: 'from-primary-500 to-primary-600' },
    { label: 'Diagnostics uniques', key: 'diagnostics', accent: 'from-primary-500 to-primary-600' },
]

export default function Statistics() {
    const [consultations, setConsultations] = useState([])
    const [rendezvous, setRendezvous] = useState([])
    const [todayConsultations, setTodayConsultations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true)
            setError(null)

            try {
                const [consultationsRes, rendezvousRes, todayRes] = await Promise.all([
                    getConsultationsService(),
                    getRendezVousService(),
                    getTodayConsultationsService(),
                ])

                setConsultations(toArray(consultationsRes))
                setRendezvous(toArray(rendezvousRes))
                setTodayConsultations(toArray(todayRes))
            } catch (err) {
                setError('Impossible de charger les statistiques.')
            } finally {
                setLoading(false)
            }
        }

        fetchStatistics()
    }, [])

    const monthlyConsultations = useMemo(
        () => buildMonthlySeries(consultations, ['date_consultation', 'created_at', 'date'], 6),
        [consultations]
    )

    const monthlyRendezVous = useMemo(
        () => buildMonthlySeries(rendezvous, ['date_heure', 'scheduled_at', 'created_at'], 6),
        [rendezvous]
    )

    const topDiagnostics = useMemo(() => {
        const count = {}
        consultations.forEach((item) => {
            const key = normalizeString(item?.diagnostic, 'Inconnu')
            count[key] = (count[key] ?? 0) + 1
        })
        return Object.entries(count)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
    }, [consultations])

    const consultationStatus = useMemo(() => {
        return Object.entries(countByStatus(consultations))
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
    }, [consultations])

    const maxConsultationValue = Math.max(...monthlyConsultations.map((item) => item.value), 1)
    const maxRendezVousValue = Math.max(...monthlyRendezVous.map((item) => item.value), 1)

    const stats = useMemo(() => {
        const diagnostics = new Set()
        consultations.forEach((item) => {
            if (item?.diagnostic) diagnostics.add(item.diagnostic)
        })

        return {
            consultations: consultations.length,
            rendezvous: rendezvous.length,
            today: todayConsultations.length,
            diagnostics: diagnostics.size,
        }
    }, [consultations, rendezvous, todayConsultations])

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm text-slate-500">Chargement des statistiques...</p>
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
                <p className="text-sm uppercase tracking-[0.28em] text-primary-700">Analyse médicale</p>
                <h1 className="mt-3 text-3xl font-semibold">Statistiques médecin</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    Visualisez l'évolution de votre activité clinique et la répartition des consultations.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                {statCards.map((card) => (
                    <div
                        key={card.key}
                        className={`rounded-[1.75rem] bg-gradient-to-br ${card.accent} p-6 text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-1 hover:shadow-xl`}
                    >
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-100/80">{card.label}</p>
                        <p className="mt-5 text-4xl font-semibold">{normalizeNumber(stats[card.key])}</p>
                        <p className="mt-3 text-sm text-slate-100/80">Mise à jour en temps réel</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Consultations par mois</h2>
                            <p className="mt-2 text-sm text-slate-500">Tendance des 6 derniers mois.</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex h-52 items-end gap-3">
                            {monthlyConsultations.map((item) => {
                                const height = Math.max(20, Math.min(100, (item.value / maxConsultationValue) * 100))
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
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Rendez-vous par mois</h2>
                            <p className="mt-2 text-sm text-slate-500">Distribution mensuelle du planning.</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex h-52 items-end gap-3">
                            {monthlyRendezVous.map((item) => {
                                const height = Math.max(20, Math.min(100, (item.value / maxRendezVousValue) * 100))
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
                            {monthlyRendezVous.map((item) => (
                                <span key={item.key}>{item.label}</span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-900">Top diagnostics</h2>
                    <p className="mt-2 text-sm text-slate-500">Diagnostics les plus fréquents.</p>

                    <div className="mt-6 space-y-4">
                        {topDiagnostics.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                                Aucun diagnostic disponible.
                            </div>
                        ) : (
                            topDiagnostics.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                                    <span className="rounded-2xl bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                        {item.value}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-900">Statuts de consultations</h2>
                    <p className="mt-2 text-sm text-slate-500">Répartition des statuts enregistrés.</p>

                    <div className="mt-6 space-y-4">
                        {consultationStatus.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                                Aucun statut disponible.
                            </div>
                        ) : (
                            consultationStatus.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-sm font-semibold capitalize text-slate-900">{item.label}</p>
                                    <span className="rounded-2xl bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                        {item.value}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
