import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Profile() {
    const auth = useSelector((state) => state.auth)
    const user = auth.user || {}
    const roleName = user.roles?.length ? user.roles[0].name : auth.role || 'Utilisateur'

    const fullName = user.name || user.fullName || 'Non defini'
    const email = user.email || 'Non defini'
    const phone = user.phone || 'Non defini'
    const address = user.address || 'Non defini'
    const lastLogin = user.last_login
        ? new Date(user.last_login).toLocaleString('fr-FR')
        : 'Jamais'
    const createdAt = user.created_at
        ? new Date(user.created_at).toLocaleDateString('fr-FR')
        : 'Non defini'
    const updatedAt = user.updated_at
        ? new Date(user.updated_at).toLocaleDateString('fr-FR')
        : 'Non defini'

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-primary-500">Medecin profil</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Mon profil</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Consultez vos informations de compte et accedez rapidement a vos modules medicaux.
                    </p>
                </div>

                <Link
                    to="/medecin/dashboard"
                    className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                    Retour au dashboard
                </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-6">
                        <h2 className="text-xl font-semibold text-slate-900">Informations de profil</h2>
                        <div className="mt-4 space-y-4 text-sm text-slate-600">
                            <div>
                                <p className="text-slate-500">Nom</p>
                                <p className="mt-1 font-semibold text-slate-900">{fullName}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Email</p>
                                <p className="mt-1 font-semibold text-slate-900">{email}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Telephone</p>
                                <p className="mt-1 font-semibold text-slate-900">{phone}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Adresse</p>
                                <p className="mt-1 font-semibold text-slate-900">{address}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Role</p>
                                <p className="mt-1 font-semibold text-slate-900">{roleName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-6">
                        <h2 className="text-xl font-semibold text-slate-900">Statut du compte</h2>
                        <div className="mt-4 space-y-4 text-sm text-slate-600">
                            <div>
                                <p className="text-slate-500">Actif</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.is_active ? 'Oui' : 'Non'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Derniere connexion</p>
                                <p className="mt-1 font-semibold text-slate-900">{lastLogin}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Compte cree</p>
                                <p className="mt-1 font-semibold text-slate-900">{createdAt}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Mise a jour</p>
                                <p className="mt-1 font-semibold text-slate-900">{updatedAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Actions rapides</h2>
                        <p className="mt-2 text-sm text-slate-500">Liens vers les pages principales de votre espace medecin.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/medecin/consultations"
                            className="inline-flex rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Mes consultations
                        </Link>
                        <Link
                            to="/medecin/rendezvous"
                            className="inline-flex rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Mes rendez-vous
                        </Link>
                        <Link
                            to="/medecin/ordonnances"
                            className="inline-flex rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Mes ordonnances
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
