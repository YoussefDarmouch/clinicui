import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/slices/authSlice";

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();

    // get user 
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const isAdmin = role === "admin";
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/");
    };
    const handleRendezvous = () => {
        if (!isAuthenticated) {
            navigate("/login", {
                state: {
                    from: location.pathname,
                },
            });
            return
        }
        navigate("/creer-rendez-vous");
    }
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="bg-primary-600 text-white shadow-md">

            {/* TOP BAR */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}
                    <Link
                        to="/"
                        className="text-2xl font-bold hover:text-primary-100"
                    >
                        Clinic System
                    </Link>

                    {/* DESKTOP MENU */}
                    <nav className="hidden md:flex items-center gap-6 font-medium">
                        <Link to="/">Accueil</Link>
                        <Link to="/medecins">Medecins</Link>
                        <Link to="/specialites">Specialites</Link>
                        <Link to="/medicaments">Medicaments</Link>
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="font-semibold">
                                Tableau de bord admin
                            </Link>
                        )}
                        <button
                            onClick={handleRendezvous}
                            className="bg-white text-primary-600 px-4 py-2 rounded-full font-semibold"
                        >
                            Creer rendez-vous
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="bg-primary-500 px-4 py-2 rounded-full"
                            >
                                Deconnexion
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-white text-primary-600 px-4 py-2 rounded-full"
                            >
                                Connexion
                            </Link>
                        )}
                    </nav>

                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                    >
                        ☰
                    </button>

                </div>
            </div>

            {/* MOBILE MENU */}
            <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-primary-700`}>

                <div className="px-4 py-3 space-y-2">

                    <Link to="/" onClick={closeMenu}>Accueil</Link>
                    <Link to="/medecins" onClick={closeMenu}>Medecins</Link>
                    <Link to="/specialites" onClick={closeMenu}>Specialites</Link>
                    <Link to="/medicaments" onClick={closeMenu}>Medicaments</Link>
                    {isAdmin && (
                        <Link to="/admin/dashboard" onClick={closeMenu}>Tableau de bord admin</Link>
                    )}
                    <button
                        onClick={() => {
                            handleRendezvous();
                            closeMenu();
                        }}
                        className="bg-white text-primary-600 px-4 py-2 rounded-full font-semibold w-full"
                    >
                        Creer rendez-vous
                    </button>

                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="bg-primary-500 px-4 py-2 rounded-full"
                        >
                            Deconnexion
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-white text-primary-600 px-4 py-2 rounded-full"
                        >
                            Connexion
                        </Link>
                    )}

                </div>

            </div>

        </div>
    );
}

