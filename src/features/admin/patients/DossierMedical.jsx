import { useEffect, useState } from 'react'
import { getDossierMedicalService } from '../services/admin.service'

export default function DossierMedical({ patientId }) {
    const [dossier, setDossier] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDossier = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getDossierMedicalService(patientId)

                const payload =
                    response?.data?.data ??
                    response?.data ??
                    response

                setDossier(payload)
            } catch (err) {
                setError('Impossible de charger le dossier médical.')
            } finally {
                setLoading(false)
            }
        }

        if (patientId) {
            fetchDossier()
        }
    }, [patientId])

    if (loading) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Chargement du dossier médical...
                </p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
                <p className="text-sm text-rose-700">
                    {error}
                </p>
            </section>
        )
    }

    if (!dossier) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                    Dossier médical
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                    Aucune information de dossier médical disponible.
                </p>
            </section>
        )
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Dossier médical
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Résumé des informations médicales du patient.
                    </p>
                </div>

                <span className="rounded-2xl bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Fiche
                </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-slate-500">
                        Antécédents médicaux
                    </p>

                    <p className="mt-2 text-base font-medium text-slate-900">
                        {dossier.antecedents_medicaux || '—'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Antécédents chirurgicaux
                    </p>

                    <p className="mt-2 text-base font-medium text-slate-900">
                        {dossier.antecedents_chirurgicaux || '—'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Traitements actuels
                    </p>

                    <p className="mt-2 text-base font-medium text-slate-900">
                        {dossier.traitements_actuels || '—'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Allergies médicamenteuses
                    </p>

                    <p className="mt-2 text-base font-medium text-slate-900">
                        {dossier.allergies_medicamenteux || 'Aucune'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Dernier vaccin
                    </p>

                    <p className="mt-2 text-base font-medium text-slate-900">
                        {dossier.dernier_vaccin
                            ? new Date(
                                dossier.dernier_vaccin
                            ).toLocaleDateString('fr-FR')
                            : '—'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Créé le
                    </p>

                    <p className="mt-2 text-base font-medium text-slate-900">
                        {dossier.created_at
                            ? new Date(
                                dossier.created_at
                            ).toLocaleDateString('fr-FR')
                            : '—'}
                    </p>
                </div>
            </div>
        </section>
    )
}