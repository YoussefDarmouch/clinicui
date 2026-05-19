import { useEffect, useState } from 'react'
import { getMedecinConsultationsService } from '../services/admin.service'

export default function Consultations({ medecinId }) {
    const [consultations, setConsultations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchConsultations = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getMedecinConsultationsService(medecinId)

                const list =
                    response?.data?.data ??
                    response?.data ??
                    response

                setConsultations(Array.isArray(list) ? list : [])
            } catch (err) {
                setError('Impossible de charger les consultations.')
            } finally {
                setLoading(false)
            }
        }

        if (medecinId) {
            fetchConsultations()
        }
    }, [medecinId])

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Consultations
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Historique des consultations du médecin.
                    </p>
                </div>

                <span className="rounded-2xl bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {consultations.length} items
                </span>
            </div>

            {loading ? (
                <p className="mt-6 text-sm text-slate-500">
                    Chargement des consultations...
                </p>
            ) : error ? (
                <p className="mt-6 text-sm text-rose-600">
                    {error}
                </p>
            ) : consultations.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">
                    Aucune consultation n’a été trouvée pour ce médecin.
                </p>
            ) : (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-4 py-4 font-semibold">
                                    Patient
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Médecin
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Diagnostic
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Traitement
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Température
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Tension
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Date
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Notes
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                            {consultations.map((consultation) => (
                                <tr
                                    key={consultation.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-4">
                                        {consultation.patient_name ||
                                            consultation.patient?.name ||
                                            '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {consultation.medecin_name ||
                                            consultation.medecin?.name ||
                                            '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {consultation.diagnostic || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {consultation.traitement || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {consultation.details?.temperature || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {consultation.details?.tension || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {consultation.date_consultation
                                            ? new Date(
                                                consultation.date_consultation
                                            ).toLocaleString('fr-FR')
                                            : '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {consultation.details?.notes || '—'}
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