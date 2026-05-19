import { useEffect, useState } from 'react'
import { getPatientOrdonnancesService } from '../services/admin.service'

export default function Ordonnances({ patientId }) {
    const [ordonnances, setOrdonnances] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOrdonnances = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getPatientOrdonnancesService(patientId)

                const payload =
                    response?.data?.data ??
                    response?.data ??
                    response

                const list = payload?.data ?? payload

                setOrdonnances(Array.isArray(list) ? list : [])
            } catch (err) {
                setError('Impossible de charger les ordonnances.')
            } finally {
                setLoading(false)
            }
        }

        if (patientId) {
            fetchOrdonnances()
        }
    }, [patientId])

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Ordonnances
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Ordonnances délivrées pour le patient.
                    </p>
                </div>

                <span className="rounded-2xl bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {ordonnances.length} items
                </span>
            </div>

            {loading ? (
                <p className="mt-6 text-sm text-slate-500">
                    Chargement des ordonnances...
                </p>
            ) : error ? (
                <p className="mt-6 text-sm text-primary-600">
                    {error}
                </p>
            ) : ordonnances.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">
                    Aucune ordonnance trouvée pour ce patient.
                </p>
            ) : (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-4 py-4 font-semibold">
                                    Médecin
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Diagnostic
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Instructions
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Date émission
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Valide jusqu’au
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Statut
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                            {ordonnances.map((ordonnance) => (
                                <tr
                                    key={ordonnance.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-4">
                                        {ordonnance.medecin?.user?.name || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {ordonnance.consultation?.diagnostic || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {ordonnance.instructions || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {ordonnance.issued_at
                                            ? new Date(
                                                ordonnance.issued_at
                                            ).toLocaleDateString('fr-FR')
                                            : '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {ordonnance.valid_until
                                            ? new Date(
                                                ordonnance.valid_until
                                            ).toLocaleDateString('fr-FR')
                                            : '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ordonnance.statut === 'active'
                                                ? 'bg-primary-100 text-primary-700'
                                                : ordonnance.statut === 'cancelled'
                                                    ? 'bg-primary-100 text-primary-700'
                                                    : 'bg-slate-100 text-slate-700'
                                                }`}
                                        >
                                            {ordonnance.statut || '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

