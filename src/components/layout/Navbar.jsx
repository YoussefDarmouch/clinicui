import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/slices/authSlice";


export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();

    // get user 
    const { isAuthenticated } = useSelector((state) => state.auth);
    const auth = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/home");
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
        navigate("/createRendezVous");
    }
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="bg-blue-600 text-white shadow-md">

            {/* TOP BAR */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}
                    <Link
                        to="/"
                        className="text-2xl font-bold hover:text-blue-100"
                    >
                        Clinic System
                    </Link>

                    {/* DESKTOP MENU */}
                    <nav className="hidden md:flex items-center gap-6 font-medium">
                        <Link to="/">Home</Link>
                        <Link to="/doctors">Doctors</Link>
                        <Link to="/specialites">Specialities</Link>
                        <Link to="/medicaments">Medicaments</Link>
                        <button
                            onClick={handleRendezvous}
                            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold"
                        >
                            Create RendezVous
                        </button>
                        {auth.role === "admin" && (
                            <Link to="/admin/dashboard">
                                Dashboard
                            </Link>
                        )}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-4 py-2 rounded-full"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-white text-blue-600 px-4 py-2 rounded-full"
                            >
                                Login
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
            <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-blue-700`}>

                <div className="px-4 py-3 space-y-2">

                    <Link to="/" onClick={closeMenu}>Home</Link>
                    <Link to="/doctors" onClick={closeMenu}>Doctors</Link>
                    <Link to="/specialites" onClick={closeMenu}>Specialities</Link>
                    <Link to="/medicaments" onClick={closeMenu}>Medicaments</Link>
                    <button
                        onClick={() => {
                            handleRendezvous();
                            closeMenu();
                        }}
                        className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold w-full"
                    >
                        Create RendezVous
                    </button>
                    {auth.role === "admin" && (
                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-full"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-white text-blue-600 px-4 py-2 rounded-full"
                        >
                            Login
                        </Link>
                    )}


                </div>

            </div>

        </div>
    );
}