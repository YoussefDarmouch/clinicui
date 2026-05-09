import React from 'react'
import { Link } from 'react-router-dom'
export default function Footer() {
    return (
        <footer className="bg-blue-700 text-white px-8 py-12">

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Logo + Description */}
                <div>
                    <h1 className="text-2xl font-bold mb-4">
                        Clinic System
                    </h1>

                    <p className="text-sm text-gray-200 leading-6">
                        Trusted medical consultation platform providing
                        professional healthcare services anytime and anywhere.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Quick Links
                    </h2>

                    <ul className="space-y-2 text-gray-200">
                        <li>
                            <Link to="/">Home</Link>
                        </li>

                        <li>
                            <Link to="/services">Services</Link>
                        </li>

                        <li>
                            <Link to="/specialites">Specialities</Link>
                        </li>

                        <li>
                            <Link to="/medicaments">Medicaments</Link>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Support
                    </h2>

                    <ul className="space-y-2 text-gray-200">
                        <li>
                            <Link to="/about">About Us</Link>
                        </li>

                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>

                        <li>
                            <Link to="/temoignages">Testimonials</Link>
                        </li>

                        <li>
                            <Link to="/faq">FAQ</Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Contact
                    </h2>

                    <div className="space-y-3 text-gray-200 text-sm">
                        <p>Email: clinic@gmail.com</p>
                        <p>Phone: +212 600000000</p>
                        <p>Address: Casablanca, Morocco</p>
                    </div>
                </div>

            </div>

            {/* Bottom Footer */}
            <div className="border-t border-blue-500 mt-10 pt-6 text-center text-sm text-gray-200">
                © 2025 Clinic System. All rights reserved.
            </div>

        </footer>
    )
}
