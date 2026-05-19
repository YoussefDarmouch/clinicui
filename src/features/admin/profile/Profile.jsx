import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Profile() {
    const auth = useSelector((state) => state.auth);
    const user = auth.user || {};
    const roleName = user.roles?.length ? user.roles[0].name : auth.role || "Utilisateur";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Admin profil</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Mon profil</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Gérez vos informations de compte et accédez rapidement aux actions administratives.
                    </p>
                </div>
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
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
                                <p className="mt-1 font-semibold text-slate-900">{user.name || "Non défini"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Email</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.email || "Non défini"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Téléphone</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.phone || "Non défini"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Adresse</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.address || "Non défini"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Rôle</p>
                                <p className="mt-1 font-semibold text-slate-900">{roleName}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-6">
                        <h2 className="text-xl font-semibold text-slate-900">Statut du compte</h2>
                        <div className="mt-4 space-y-4 text-sm text-slate-600">
                            <div>
                                <p className="text-slate-500">Actif</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.is_active ? "Oui" : "Non"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Dernière connexion</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.last_login ? new Date(user.last_login).toLocaleString() : "Jamais"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Compte créé</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Non défini"}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Mise à jour</p>
                                <p className="mt-1 font-semibold text-slate-900">{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "Non défini"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Actions rapides</h2>
                        <p className="mt-2 text-sm text-slate-500">Liens vers les pages principales de l’administration.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/"
                            className="inline-flex rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Aller à l’accueil
                        </Link>
                        <Link
                            to="/admin/users"
                            className="inline-flex rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Gérer les utilisateurs
                        </Link>
                        <Link
                            to="/admin/patients"
                            className="inline-flex rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Gérer les patients
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
