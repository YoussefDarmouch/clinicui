import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-4">
                Welcome to Clinic App
            </h1>

            <p className="mb-6 text-gray-600">
                Manage appointments, consultations and medical records easily.
            </p>

            <div className="flex gap-4">

                <Link
                    to="/medecins"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    View Doctors
                </Link>

                <Link
                    to="/specialites"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Specialities
                </Link>

            </div>

        </div>
    );
}