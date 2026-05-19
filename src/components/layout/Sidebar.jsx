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
        <aside className="sticky top-0 h-screen w-72 flex-shrink-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 px-6 py-8 text-slate-300 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.8)]">
            <div className="flex h-full flex-col justify-between">
                <div className="space-y-6 overflow-y-auto pr-1">
                    <div className="mb-8 rounded-2xl bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
                            Espace admin
                        </p>

                        <h2 className="mt-3 text-2xl font-bold text-white">
                            Clinic
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
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
                                            ? 'bg-sky-500/20 text-white'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }`
                                    }
                                >
                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 opacity-90" />

                                    <span className="truncate">
                                        {link.label}
                                    </span>
                                </NavLink>
                            ))}
                        </nav>
                    )}

                    <div className="mt-8 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                        <p className="font-semibold text-white">
                            Raccourci
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Utilisez cette barre pour accéder rapidement
                            aux modules.
                        </p>
                    </div>
                </div>

                <div className="mt-6 shrink-0">
                    {auth.isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
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