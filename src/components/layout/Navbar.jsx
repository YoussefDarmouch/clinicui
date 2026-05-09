import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logout } from "../../app/slices/authSlice";

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/login");
    };

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

                        <Link
                            to="/createRendezVous"
                            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold"
                        >
                            Book Appointment
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-full"
                        >
                            Logout
                        </button>
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

                    <Link
                        to="/createRendezVous"
                        onClick={closeMenu}
                        className="block bg-white text-blue-600 px-3 py-2 rounded"
                    >
                        Book Appointment
                    </Link>

                    <button
                        onClick={() => {
                            handleLogout();
                            closeMenu();
                        }}
                        className="bg-red-500 px-3 py-2 rounded w-full"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}