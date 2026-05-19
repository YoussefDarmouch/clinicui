import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../app/slices/authSlice'

const links = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Utilisateurs' },
    { to: '/admin/medecins', label: 'Médecins' },
    { to: '/admin/specialites', label: 'Spécialités' },
    { to: '/admin/patients', label: 'Patients' },
    { to: '/admin/profile', label: 'Profil' },
]

export default function Sidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        localStorage.clear()
        navigate('/')
    }

    return (
        <aside className="sticky top-0 h-screen w-72 flex-shrink-0 bg-primary-50 px-6 py-8 text-slate-900 shadow-lg shadow-slate-900/5">
            <div className="flex h-full flex-col justify-between">
                <div className="space-y-6 overflow-y-auto pr-1">
                    <div className="mb-8 rounded-2xl bg-white/90 p-5 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-primary-600">
                            Espace admin
                        </p>

                        <h2 className="mt-3 text-2xl font-bold text-slate-900">
                            Clinic
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Navigation rapide pour les modules clés.
                        </p>
                    </div>

                    {auth.role === 'admin' && (
                        <nav className="space-y-2">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-3 transition ${isActive
                                            ? 'bg-primary-500/20 text-slate-900'
                                            : 'text-slate-700 hover:bg-primary-100 hover:text-slate-900'
                                        }`
                                    }
                                >
                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-600 opacity-90" />

                                    <span className="truncate">
                                        {link.label}
                                    </span>
                                </NavLink>
                            ))}
                        </nav>
                    )}

                    <div className="mt-8 rounded-2xl bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
                        <p className="font-semibold text-slate-900">
                            Raccourci
                        </p>

                        <p className="mt-2 text-xs text-slate-600">
                            Utilisez cette barre pour accéder rapidement
                            aux modules.
                        </p>
                    </div>
                </div>

                <div className="mt-6 shrink-0">
                    {auth.isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </aside>
    )
}


