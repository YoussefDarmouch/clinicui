import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsersService, deleteUserService } from '../services/admin.service'

export default function UsersList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const response = await getUsersService()
                setUsers(response?.data.data ?? [])
            } catch (err) {
                setError('Impossible de récupérer les utilisateurs.')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const filteredUsers = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return users
        return users.filter((user) => {
            return [user.name, user.email, user.phone]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(normalized))
        })
    }, [query, users])

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Supprimer cet utilisateur ?')
        if (!confirmed) return

        try {
            await deleteUserService(id)
            setUsers((current) => current.filter((user) => user.id !== id))
        } catch (err) {
            window.alert('Impossible de supprimer l’utilisateur.')
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Utilisateurs</h1>
                        <p className="mt-2 text-sm text-slate-500">Gérez les comptes utilisateurs, les rôles et les statuts.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Rechercher un utilisateur..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 sm:w-72"
                        />
                        <Link
                            to="/admin/users/new"
                            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                        >
                            Nouveau utilisateur
                        </Link>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {loading ? (
                    <p className="text-sm text-slate-500">Chargement des utilisateurs...</p>
                ) : error ? (
                    <p className="text-sm text-rose-600">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-4 font-semibold">Utilisateur</th>
                                    <th className="px-4 py-4 font-semibold">Email</th>
                                    <th className="px-4 py-4 font-semibold">Rôle</th>
                                    <th className="px-4 py-4 font-semibold">Statut</th>
                                    <th className="px-4 py-4 font-semibold">Créé</th>
                                    <th className="px-4 py-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-6 text-center text-sm text-slate-500">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="transition hover:bg-slate-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold uppercase text-slate-700">
                                                        {user.name?.split(' ').slice(0, 2).map((part) => part[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <Link to={`/admin/users/${user.id}`} className="font-semibold text-slate-900 hover:text-sky-600">
                                                            {user.name}
                                                        </Link>
                                                        <p className="text-xs text-slate-500">{user.phone || '—'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">{user.email}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {user.roles?.[0]?.name || 'Utilisateur'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {user.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-4 py-4 space-x-2">
                                                <Link
                                                    to={`/admin/users/${user.id}`}
                                                    className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                                >
                                                    Détails
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
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
