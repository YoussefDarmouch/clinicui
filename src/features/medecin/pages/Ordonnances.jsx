import { useEffect, useMemo, useState } from 'react'
import {
    getOrdonnanceMedicamentsService,
    getOrdonnancesService,
} from '../services/medecin.service'
import {
    formatDate,
    getStatusBadgeClass,
    normalizeString,
    PAGE_SIZE,
    safeContains,
    toArray,
} from './page.utils'

const normalizeOrdonnances = (payload) =>
    toArray(payload).map((ordonnance, index) => {
        const consultation = ordonnance?.consultation ?? {}
        const rawId = Number(ordonnance?.id)
        const id = Number.isFinite(rawId) && rawId > 0 ? rawId : null

        return {
            id,
            rowKey: id ?? `ordonnance-${index}`,
            consultationId: ordonnance?.consultation_id ?? consultation?.id,
            patient:
                ordonnance?.patient_name ??
                ordonnance?.patient?.user?.name ??
                ordonnance?.patient?.name ??
                consultation?.patient_name ??
                consultation?.patient?.name ??
                consultation?.patient,
            medecin:
                ordonnance?.medecin_name ??
                ordonnance?.medecin?.user?.name ??
                ordonnance?.medecin?.name ??
                consultation?.medecin_name ??
                consultation?.medecin?.name ??
                consultation?.medecin?.user?.name,
            diagnostic: ordonnance?.diagnostic ?? consultation?.diagnostic,
            instructions: ordonnance?.instructions ?? ordonnance?.notes ?? ordonnance?.contenu,
            issuedAt: ordonnance?.issued_at ?? ordonnance?.created_at ?? consultation?.date_consultation,
            validUntil: ordonnance?.valid_until,
            statut: ordonnance?.statut ?? ordonnance?.status ?? 'active',
            medicaments: Array.isArray(ordonnance?.medicaments) ? ordonnance.medicaments : [],
        }
    })

export default function Ordonnances() {
    const [ordonnances, setOrdonnances] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [medicamentsByOrdonnance, setMedicamentsByOrdonnance] = useState({})
    const [medicamentLoadingId, setMedicamentLoadingId] = useState(null)

    useEffect(() => {
        const fetchOrdonnances = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getOrdonnancesService()
                const rows = normalizeOrdonnances(response)
                setOrdonnances(rows)
                setMedicamentsByOrdonnance(
                    rows.reduce((acc, item) => {
                        if (item.id) acc[item.id] = item.medicaments
                        return acc
                    }, {})
                )
            } catch (err) {
                setError('Impossible de récupérer les ordonnances.')
            } finally {
                setLoading(false)
            }
        }

        fetchOrdonnances()
    }, [])

    const filteredOrdonnances = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return ordonnances

        return ordonnances.filter((item) =>
            [
                item?.patient,
                item?.medecin,
                item?.diagnostic,
                item?.instructions,
                item?.statut,
            ].some((field) => safeContains(field, normalized))
        )
    }, [query, ordonnances])

    const pageCount = Math.max(1, Math.ceil(filteredOrdonnances.length / PAGE_SIZE))
    const visibleOrdonnances = filteredOrdonnances.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const loadMedicaments = async (ordonnanceId) => {
        if (!ordonnanceId || medicamentsByOrdonnance[ordonnanceId]) return

        setMedicamentLoadingId(ordonnanceId)
        try {
            const response = await getOrdonnanceMedicamentsService(ordonnanceId)
            const list = toArray(response)
            setMedicamentsByOrdonnance((current) => ({
                ...current,
                [ordonnanceId]: list,
            }))
        } catch (err) {
            setMedicamentsByOrdonnance((current) => ({
                ...current,
                [ordonnanceId]: [],
            }))
            window.alert('Impossible de récupérer les médicaments de cette ordonnance.')
        } finally {
            setMedicamentLoadingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Ordonnances</h1>
                        <p className="mt-2 text-sm text-slate-500">Consultez les prescriptions liées à vos consultations.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setPage(1)
                            }}
                            placeholder="Rechercher une ordonnance..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 sm:w-72"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-sm text-slate-500">Chargement des ordonnances...</p>
                ) : error ? (
                    <p className="text-sm text-primary-600">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-4 font-semibold">Patient</th>
                                        <th className="px-4 py-4 font-semibold">Diagnostic</th>
                                        <th className="px-4 py-4 font-semibold">Instructions</th>
                                        <th className="px-4 py-4 font-semibold">Date émission</th>
                                        <th className="px-4 py-4 font-semibold">Valide jusqu'au</th>
                                        <th className="px-4 py-4 font-semibold">Statut</th>
                                        <th className="px-4 py-4 font-semibold">Médicaments</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {visibleOrdonnances.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-6 text-center text-sm text-slate-500">
                                                Aucune ordonnance trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        visibleOrdonnances.map((item) => {
                                            const medicaments = medicamentsByOrdonnance[item.id]
                                            const medicamentCount = Array.isArray(medicaments) ? medicaments.length : null
                                            return (
                                                <tr key={item.rowKey} className="transition hover:bg-slate-50">
                                                    <td className="px-4 py-4 font-semibold text-slate-900">{normalizeString(item.patient)}</td>
                                                    <td className="px-4 py-4">{normalizeString(item.diagnostic)}</td>
                                                    <td className="px-4 py-4">{normalizeString(item.instructions)}</td>
                                                    <td className="px-4 py-4">{formatDate(item.issuedAt)}</td>
                                                    <td className="px-4 py-4">{formatDate(item.validUntil)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(item.statut)}`}>
                                                            {normalizeString(item.statut, 'active')}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => loadMedicaments(item.id)}
                                                            disabled={!item.id || medicamentLoadingId === item.id}
                                                            className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {medicamentLoadingId === item.id
                                                                ? 'Chargement...'
                                                                : medicamentCount !== null
                                                                    ? `${medicamentCount} item(s)`
                                                                    : 'Voir'}
                                                        </button>
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
                                Affichage de {visibleOrdonnances.length} sur {filteredOrdonnances.length} ordonnances
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
