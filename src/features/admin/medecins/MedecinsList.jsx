import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../../components/ui/Modal'
import { getMedecinsService, deleteMedecinService } from '../services/admin.service'

const PAGE_SIZE = 10

export default function MedecinsList() {
    const [medecins, setMedecins] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [confirmDelete, setConfirmDelete] = useState(null)

    useEffect(() => {
        const fetchMedecins = async () => {
            setLoading(true)
            try {
                const response = await getMedecinsService()
                const list = response?.data?.data ?? response?.data ?? response
                setMedecins(list)
            } catch (err) {
                setError('Impossible de récupérer les médecins.')
            } finally {
                setLoading(false)
            }
        }

        fetchMedecins()
    }, [])

    const filteredMedecins = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return medecins

        return medecins.filter((medecin) => {
            return [
                medecin.user?.name,
                medecin.user?.email,
                medecin.numero_licence,
                medecin.specialite?.name,
            ]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(normalized))
        })
    }, [query, medecins])

    const pageCount = Math.max(1, Math.ceil(filteredMedecins.length / PAGE_SIZE))
    const visibleMedecins = filteredMedecins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleDelete = async () => {
        if (!confirmDelete) return

        try {
            await deleteMedecinService(confirmDelete.id)
            setMedecins((current) => current.filter((item) => item.id !== confirmDelete.id))
            setConfirmDelete(null)
        } catch (err) {
            window.alert('Impossible de supprimer le médecin.')
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Médecins</h1>
                        <p className="mt-2 text-sm text-slate-500">Gérez les profils médecins, licences et spécialités.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setPage(1)
                            }}
                            placeholder="Rechercher un médecin..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 sm:w-72"
                        />
                        <Link
                            to="/admin/medecins/new"
                            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                        >
                            Nouveau médecin
                        </Link>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-sm text-slate-500">Chargement des médecins...</p>
                ) : error ? (
                    <p className="text-sm text-rose-600">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-4 font-semibold">Médecin</th>
                                        <th className="px-4 py-4 font-semibold">Licence</th>
                                        <th className="px-4 py-4 font-semibold">Spécialité</th>
                                        <th className="px-4 py-4 font-semibold">Expérience</th>
                                        <th className="px-4 py-4 font-semibold">Statut</th>
                                        <th className="px-4 py-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {visibleMedecins.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-center text-sm text-slate-500">
                                                Aucun médecin trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        visibleMedecins.map((medecin) => (
                                            <tr key={medecin.id} className="transition hover:bg-slate-50">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold uppercase text-slate-700">
                                                            {medecin.user?.name?.split(' ').slice(0, 2).map((part) => part[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <Link to={`/admin/medecins/${medecin.id}`} className="font-semibold text-slate-900 hover:text-sky-600">
                                                                {medecin.user?.name || 'Médecin inconnu'}
                                                            </Link>
                                                            <p className="text-xs text-slate-500">{medecin.user?.email || '—'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">{medecin.numero_licence || '—'}</td>
                                                <td className="px-4 py-4">{medecin.specialite?.name || '—'}</td>
                                                <td className="px-4 py-4">{medecin.annees_experience ?? '—'} ans</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${medecin.user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                        {medecin.user.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 space-x-2">
                                                    <Link
                                                        to={`/admin/medecins/${medecin.id}`}
                                                        className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                                    >
                                                        Détails
                                                    </Link>
                                                    <button
                                                        onClick={() => setConfirmDelete({ id: medecin.id, name: medecin.user?.name || medecin.numero_licence })}
                                                        className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                Affichage de {visibleMedecins.length} sur {filteredMedecins.length} médecins
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
                                Supprimer le médecin <strong>{confirmDelete.name}</strong> est irréversible.
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
                                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
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
