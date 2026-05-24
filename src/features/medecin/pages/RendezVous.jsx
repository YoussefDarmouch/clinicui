import { useEffect, useMemo, useState } from 'react'
import {
    cancelRendezVousService,
    confirmRendezVousService,
    getRendezVousService,
} from '../services/medecin.service'
import {
    formatDate,
    getInitials,
    getStatusBadgeClass,
    normalizeString,
    PAGE_SIZE,
    safeContains,
    toArray,
} from './page.utils'

const normalizeRendezVousRows = (payload) =>
    toArray(payload).map((item, index) => {
        const rawId = Number(item?.id)
        const id = Number.isFinite(rawId) && rawId > 0 ? rawId : null
        const status = item?.statut ?? item?.status ?? 'inconnu'

        return {
            id,
            rowKey: id ?? `rendezvous-${index}`,
            patientName: item?.patient_name ?? item?.patient?.name ?? item?.patient?.user?.name,
            medecinName: item?.medecin_name ?? item?.medecin?.name ?? item?.medecin?.user?.name,
            motif: item?.motif,
            notes: item?.details?.notes,
            consultation: item?.consultation ?? null,
            dateHeure: item?.date_heure ?? item?.scheduled_at,
            status,
        }
    })

export default function RendezVous() {
    const [rendezvous, setRendezvous] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [actionLoadingId, setActionLoadingId] = useState(null)

    useEffect(() => {
        const fetchRendezVous = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getRendezVousService()
                setRendezvous(normalizeRendezVousRows(response))
            } catch (err) {
                setError('Impossible de récupérer les rendez-vous.')
            } finally {
                setLoading(false)
            }
        }

        fetchRendezVous()
    }, [])

    const filteredRendezVous = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return rendezvous

        return rendezvous.filter((item) =>
            [
                item?.patientName,
                item?.medecinName,
                item?.motif,
                item?.notes,
                item?.consultation?.diagnostic,
                item?.status,
                item?.dateHeure,
            ].some((field) => safeContains(field, normalized))
        )
    }, [query, rendezvous])

    const pageCount = Math.max(1, Math.ceil(filteredRendezVous.length / PAGE_SIZE))
    const visibleRendezVous = filteredRendezVous.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const updateStatus = (id, nextStatus) => {
        setRendezvous((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: nextStatus,
                    }
                    : item
            )
        )
    }

    const handleConfirm = async (id) => {
        setActionLoadingId(id)
        try {
            await confirmRendezVousService(id)
            updateStatus(id, 'complete')
        } catch (err) {
            window.alert('Impossible de confirmer le rendez-vous.')
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleCancel = async (id) => {
        setActionLoadingId(id)
        try {
            await cancelRendezVousService(id)
            updateStatus(id, 'annule')
        } catch (err) {
            window.alert('Impossible d’annuler le rendez-vous.')
        } finally {
            setActionLoadingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Rendez-vous</h1>
                        <p className="mt-2 text-sm text-slate-500">Gérez votre planning, vos confirmations et vos annulations.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setPage(1)
                            }}
                            placeholder="Rechercher un rendez-vous..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 sm:w-72"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-sm text-slate-500">Chargement des rendez-vous...</p>
                ) : error ? (
                    <p className="text-sm text-primary-600">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-4 font-semibold">Patient</th>
                                        <th className="px-4 py-4 font-semibold">Motif</th>
                                        <th className="px-4 py-4 font-semibold">Date</th>
                                        <th className="px-4 py-4 font-semibold">Statut</th>
                                        <th className="px-4 py-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {visibleRendezVous.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-sm text-slate-500">
                                                Aucun rendez-vous trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        visibleRendezVous.map((item) => {
                                            const status = item?.status ?? 'inconnu'
                                            const normalized = String(status).toLowerCase()
                                            const canConfirm = !(
                                                normalized.includes('confirm') ||
                                                normalized.includes('complet') ||
                                                normalized.includes('cancel') ||
                                                normalized.includes('annul')
                                            )
                                            const canCancel = !(
                                                normalized.includes('complet') ||
                                                normalized.includes('cancel') ||
                                                normalized.includes('annul')
                                            )
                                            const isRowLoading = actionLoadingId === item.id

                                            return (
                                                <tr key={item.rowKey} className="transition hover:bg-slate-50">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold uppercase text-slate-700">
                                                                {getInitials(item?.patientName)}
                                                            </div>
                                                            <p className="font-semibold text-slate-900">
                                                                {normalizeString(item?.patientName)}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">{normalizeString(item?.motif)}</td>
                                                    <td className="px-4 py-4">{formatDate(item?.dateHeure, true)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(status)}`}>
                                                            {normalizeString(status, 'inconnu')}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleConfirm(item.id)}
                                                                disabled={!item.id || !canConfirm || isRowLoading}
                                                                className="rounded-2xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                Confirmer
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCancel(item.id)}
                                                                disabled={!item.id || !canCancel || isRowLoading}
                                                                className="rounded-2xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                Annuler
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                Affichage de {visibleRendezVous.length} sur {filteredRendezVous.length} rendez-vous
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
                                    disabled={page === 1}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Précédent
                                </button>
                                <span className="text-sm text-slate-500">Page {page} / {pageCount}</span>
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.min(current + 1, pageCount))}
                                    disabled={page === pageCount}
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
