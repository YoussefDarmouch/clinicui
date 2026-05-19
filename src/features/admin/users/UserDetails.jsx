import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserForm from './UserForm'
import {
    deleteUserService,
    getUserService,
} from '../services/admin.service'

export default function UserDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
                const response = await getUserService(id)
                const payload = response?.data ?? response
                setUser(payload)
            } catch (err) {
                setError('Impossible de charger les informations de l’utilisateur.')
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [id])

    const handleDelete = async () => {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')
        if (!confirmed) return

        try {
            await deleteUserService(id)
            navigate('/admin/users')
        } catch (err) {
            window.alert('Suppression échouée.')
        }
    }

    const handleUpdateSuccess = (updatedUser) => {
        setUser(updatedUser)
        setEditing(false)
    }

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Chargement des détails utilisateur...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
                <p className="text-sm text-rose-700">{error}</p>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{user.name}</h1>
                    <p className="mt-2 text-sm text-slate-500">Profil utilisateur détaillé</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setEditing((current) => !current)}
                        className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                        {editing ? 'Annuler' : 'Modifier'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-2xl bg-rose-100 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                    >
                        Supprimer
                    </button>
                    <Link
                        to="/admin/users"
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Retour à la liste
                    </Link>
                </div>
            </div>

            {editing ? (
                <UserForm user={user} onSuccess={handleUpdateSuccess} onCancel={() => setEditing(false)} />
            ) : (
                <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl font-semibold text-slate-700">
                                {user.name?.split(' ').slice(0, 2).map((part) => part[0]).join('')}
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Rôle principal</p>
                                <p className="mt-2 text-xl font-semibold text-slate-900">{user.roles?.[0]?.name || 'Utilisateur'}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">Adresse email</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Téléphone</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{user.phone || 'Non renseigné'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Adresse</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{user.address || 'Non renseignée'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Statut</p>
                                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {user.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Informations complémentaires</h2>
                        <div className="mt-6 space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">Dernière connexion</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{user.last_login ? new Date(user.last_login).toLocaleString('fr-FR') : 'Jamais'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Créé le</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Mis à jour le</p>
                                <p className="mt-2 text-base font-medium text-slate-900">{new Date(user.updated_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Rôles attribués</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {user.roles?.map((role) => (
                                        <span key={role.id} className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {role.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
