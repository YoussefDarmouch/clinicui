import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/slices/authSlice';
import {
    Bell,
    Search,
    Menu,
    X,
    Home,
    Users,
    Star,
    Pill,
    CalendarDays,
    Mail,
    Plus,
    ChevronDown,
    LayoutDashboard,
} from 'lucide-react';

const navItems = [
    { name: 'Accueil', to: '/', icon: Home },
    { name: 'Médecins', to: '/medecins', icon: Users },
    { name: 'Spécialités', to: '/specialites', icon: Star },
    { name: 'Médicaments', to: '/medicaments', icon: Pill },
    { name: 'Rendez-vous', to: '/creer-rendez-vous', icon: CalendarDays },
    { name: 'Contact', to: '/contact', icon: Mail },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated, role, user } = useSelector((state) => state.auth);
    const isAdmin = role === 'admin';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleRendezvous = () => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: location.pathname,
                },
            });
            return;
        }
        navigate('/creer-rendez-vous');
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/medecins?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const isActive = (path) => location.pathname === path;
    const userName = user?.fullName || user?.name || user?.email || '';
    const userRole = isAdmin ? 'Administrateur' : '';
    const avatarUrl = user?.avatar || user?.avatarUrl || '';
    const initials = userName ? userName.charAt(0).toUpperCase() : 'U';

    return (
        <header className="bg-white text-slate-900 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 py-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center justify-between gap-4">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                                <span className="text-2xl font-bold">+</span>
                            </div>
                            <div>
                                <p className="text-lg font-semibold">MediCare</p>
                                <p className="text-sm text-slate-500">Votre santé, notre priorité</p>
                            </div>
                        </Link>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-3 text-slate-700 transition hover:bg-slate-50 xl:hidden"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <div className="hidden xl:flex xl:flex-1 xl:items-center xl:justify-center">
                        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Rechercher un médecin, spécialité, médicament..."
                                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            />
                        </form>
                    </div>

                    <div className="hidden xl:flex xl:items-center xl:gap-4">
                        <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                            <Bell size={20} />
                        </button>
                        {userName && (
                            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="User avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span>{initials}</span>
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-semibold">{userName}</p>
                                    {userRole && <p className="text-xs text-emerald-600">{userRole}</p>}
                                </div>
                                <ChevronDown size={18} className="text-slate-500" />
                            </div>
                        )}
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Déconnexion
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center gap-2 py-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${isActive(item.to)
                                        ? 'bg-white text-emerald-600 shadow-sm'
                                        : 'text-slate-600 hover:bg-white hover:text-emerald-600'
                                        }`}
                                >
                                    <Icon size={16} className="hidden sm:inline-flex" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        {isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isActive('/admin/dashboard')
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-slate-600 hover:bg-white hover:text-emerald-600'
                                    }`}
                            >  <LayoutDashboard size={18} />
                                Tableau de bord admin
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={handleRendezvous}
                            className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                            <Plus size={16} /> Créer un rendez-vous
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="border-t border-slate-200 bg-white xl:hidden">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <form onSubmit={handleSearchSubmit} className="relative mb-4">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Rechercher un médecin, spécialité, médicament..."
                                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            />
                        </form>
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${isActive(item.to)
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            {isAdmin && (
                                <Link
                                    to="/admin/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive('/admin/dashboard')
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <LayoutDashboard size={18} />
                                    Tableau de bord admin
                                </Link>
                            )}
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    handleRendezvous();
                                    setIsMenuOpen(false);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                <Plus size={16} /> Créer un rendez-vous
                            </button>
                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Déconnexion
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Connexion
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

