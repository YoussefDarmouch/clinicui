import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";

export default function Sidebar() {
    const auth = useSelector((state) => state.auth);
    console.log("ROLE:", auth.role);

    return (
        <aside className="w-64 h-screen bg-white shadow p-4">
            <h2 className="text-xl font-bold mb-4">Clinic</h2>
            {auth.role === "admin" && (
                <>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/medecins">Médecins</Link>
                    <Link to="/admin/patients">Patients</Link>
                </>
            )}
        </aside>
    )
}
