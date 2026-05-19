import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../../components/ui/Modal'
import { getPatientsService, deletePatientService } from '../services/admin.service'

const PAGE_SIZE = 10

export default function PatientsList() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [confirmDelete, setConfirmDelete] = useState(null)

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await getPatientsService()
                const list = response?.data?.data ?? response?.data ?? response
                setPatients(Array.isArray(list) ? list : [])
            } catch (err) {
                setError('Impossible de récupérer les patients.')
            } finally {
                setLoading(false)
            }
        }

        fetchPatients()
    }, [])

    const filteredPatients = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return patients

        return patients.filter((patient) => {
            const name = patient.user?.name || patient.name || ''
            const email = patient.user?.email || patient.email || ''
            const phone = patient.user?.phone || patient.phone || ''
            const social = patient.numero_securite_sociale || ''
            return [name, email, phone, social].some((field) => field.toLowerCase().includes(normalized))
        })
    }, [query, patients])

    const pageCount = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE))
    const visiblePatients = filteredPatients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleDelete = async () => {
        if (!confirmDelete) return

        try {
            await deletePatientService(confirmDelete.id)
            setPatients((current) => current.filter((patient) => patient.id !== confirmDelete.id))
            setConfirmDelete(null)
        } catch (err) {
            window.alert('Impossible de supprimer le patient.')
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
                        <p className="mt-2 text-sm text-slate-500">Gérez les dossiers patients, les consultations et les ordonnances.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setPage(1)
                            }}
                            placeholder="Rechercher un patient..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 sm:w-72"
                        />
                        <Link
                            to="/admin/patients/new"
                            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                            Nouveau patient
                        </Link>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-sm text-slate-500">Chargement des patients...</p>
                ) : error ? (
                    <p className="text-sm text-primary-600">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-4 font-semibold">Patient</th>
                                        <th className="px-4 py-4 font-semibold">Email</th>
                                        <th className="px-4 py-4 font-semibold">Sexe</th>
                                        <th className="px-4 py-4 font-semibold">Groupe sanguin</th>
                                        <th className="px-4 py-4 font-semibold">Créé</th>
                                        <th className="px-4 py-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {visiblePatients.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-center text-sm text-slate-500">
                                                Aucun patient trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        visiblePatients.map((patient) => {
                                            const name = patient.user?.name || patient.name || 'Patient inconnu'
                                            const email = patient.user?.email || patient.email || '—'
                                            const phone = patient.user?.phone || patient.phone || '—'
                                            const initials = name.split(' ').slice(0, 2).map((part) => part[0]).join('')
                                            return (
                                                <tr key={patient.id} className="transition hover:bg-slate-50">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold uppercase text-slate-700">
                                                                {initials}
                                                            </div>
                                                            <div>
                                                                <Link to={`/admin/patients/${patient.id}`} className="font-semibold text-slate-900 hover:text-primary-700">
                                                                    {name}
                                                                </Link>
                                                                <p className="text-xs text-slate-500">{phone}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">{email}</td>
                                                    <td className="px-4 py-4">{patient.sexe || '—'}</td>
                                                    <td className="px-4 py-4">{patient.groupe_sanguin || '—'}</td>
                                                    <td className="px-4 py-4">{patient.created_at ? new Date(patient.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                                                    <td className="px-4 py-4 space-x-2">
                                                        <Link
                                                            to={`/admin/patients/${patient.id}`}
                                                            className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                                        >
                                                            Détails
                                                        </Link>
                                                        <button
                                                            onClick={() => setConfirmDelete({ id: patient.id, name })}
                                                            className="rounded-2xl bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                                                        >
                                                            Supprimer
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
                                Affichage de {visiblePatients.length} sur {filteredPatients.length} patients
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

            {confirmDelete && (
                <Modal isOpen={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Confirmer la suppression</h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Supprimer le patient <strong>{confirmDelete.name}</strong> est irréversible.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(null)}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}




