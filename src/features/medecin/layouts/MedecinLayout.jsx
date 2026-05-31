import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../app/slices/authSlice";

const links = [
    { to: "/medecin/dashboard", label: "Dashboard" },
    { to: "/medecin/rendezvous", label: "Rendezvous" },
    { to: "/medecin/consultations", label: "Consultations" },
    { to: "/medecin/patients", label: "Patients" },
    { to: "/medecin/ordonnances", label: "Ordonnances" },
    { to: "/medecin/profile", label: "Profile" },
    { to: "/medecin/notifications", label: "Notifications" },
    { to: "/medecin/statistics", label: "Statistics" },
];

export default function MedecinLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="flex min-h-screen">
            <aside className="sticky top-0 h-screen w-72 flex-shrink-0 bg-primary-50 px-6 py-8 text-slate-900 shadow-lg shadow-slate-900/5">
                <div className="flex h-full flex-col justify-between">
                    <div className="space-y-6 overflow-y-auto pr-1">
                        <div className="mb-8 rounded-2xl bg-white/90 p-5 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.3em] text-primary-600">
                                Espace médecin
                            </p>
                            <h2 className="mt-3 text-2xl font-bold text-slate-900">Clinic</h2>
                            <p className="mt-2 text-sm text-slate-600">Suivi clinique quotidien.</p>
                        </div>

                        <nav className="space-y-2">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                                            isActive
                                                ? "bg-primary-500/20 text-slate-900"
                                                : "text-slate-700 hover:bg-primary-100 hover:text-slate-900"
                                        }`
                                    }
                                >
                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-600 opacity-90" />
                                    <span className="truncate">{link.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6 shrink-0">
                        {auth.isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                            >
                                Logout
                            </button>
                        ) : null}
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col bg-gray-50">
                <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl shadow-sm">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Espace médecin</p>
                            <h1 className="text-xl font-semibold text-slate-900">Gestion médicale</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/"
                                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/medecin/profile"
                                className="inline-flex items-center rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
                            >
                                Profil
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
