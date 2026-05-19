import { useEffect, useState } from 'react'
import { getMedecinRendezVousService } from '../services/admin.service'

export default function RendezVous({ medecinId }) {
    const [rendezvous, setRendezvous] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRendezVous = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getMedecinRendezVousService(medecinId)

                const list =
                    response?.data?.data ??
                    response?.data ??
                    response

                setRendezvous(Array.isArray(list) ? list : [])
            } catch (err) {
                setError('Impossible de charger les rendez-vous.')
            } finally {
                setLoading(false)
            }
        }

        if (medecinId) {
            fetchRendezVous()
        }
    }, [medecinId])

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Rendez-vous
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Prochains rendez-vous du médecin.
                    </p>
                </div>

                <span className="rounded-2xl bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {rendezvous.length} items
                </span>
            </div>

            {loading ? (
                <p className="mt-6 text-sm text-slate-500">
                    Chargement des rendez-vous...
                </p>
            ) : error ? (
                <p className="mt-6 text-sm text-primary-600">
                    {error}
                </p>
            ) : rendezvous.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">
                    Aucun rendez-vous n’a été trouvé pour ce médecin.
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
                                    Motif
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Date
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Notes
                                </th>

                                <th className="px-4 py-4 font-semibold">
                                    Statut
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                            {rendezvous.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-4">
                                        {item.patient_name ||
                                            item.patient?.name ||
                                            '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {item.medecin_name ||
                                            item.medecin?.name ||
                                            '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {item.motif || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {item.date_heure
                                            ? new Date(
                                                item.date_heure
                                            ).toLocaleString('fr-FR')
                                            : '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {item.details?.notes || '—'}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {item.statut || '—'}
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

