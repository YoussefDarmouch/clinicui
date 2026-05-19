import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSpecialitesService, deleteSpecialiteService } from '../services/admin.service'

export default function SpecialitesList() {
    const [specialites, setSpecialites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')

    useEffect(() => {
        const fetchSpecialites = async () => {
            setLoading(true)
            try {
                const response = await getSpecialitesService()
                // API might return data at response.data.data or response.data
                setSpecialites(response?.data?.data ?? response?.data ?? response ?? [])
            } catch (err) {
                setError('Impossible de récupérer les spécialités.')
            } finally {
                setLoading(false)
            }
        }

        fetchSpecialites()
    }, [])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return specialites
        return specialites.filter((s) => (s.name || '').toLowerCase().includes(q))
    }, [query, specialites])

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Supprimer cette spécialité ?')
        if (!confirmed) return

        try {
            await deleteSpecialiteService(id)
            setSpecialites((current) => current.filter((s) => s.id !== id))
        } catch (err) {
            window.alert('Impossible de supprimer la spécialité.')
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Spécialités</h1>
                        <p className="mt-2 text-sm text-slate-500">Gérez les spécialités médicales.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher une spécialité..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 sm:w-72"
                        />
                        <Link
                            to="/admin/specialites/new"
                            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                        >
                            Nouvelle spécialité
                        </Link>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-sm text-slate-500">Chargement des spécialités...</p>
                ) : error ? (
                    <p className="text-sm text-rose-600">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-4 font-semibold">Nom</th>
                                    <th className="px-4 py-4 font-semibold">Créé</th>
                                    <th className="px-4 py-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-6 text-center text-sm text-slate-500">
                                            Aucune spécialité trouvée.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((s) => (
                                        <tr key={s.id} className="transition hover:bg-slate-50">
                                            <td className="px-4 py-4">
                                                <Link to={`/admin/specialites/${s.id}`} className="font-semibold text-slate-900 hover:text-sky-600">
                                                    {s.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4">{s.created_at ? new Date(s.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                                            <td className="px-4 py-4 space-x-2">
                                                <Link
                                                    to={`/admin/specialites/${s.id}`}
                                                    className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                                >
                                                    Éditer
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(s.id)}
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
                )}
            </div>
        </div>
    )
}
