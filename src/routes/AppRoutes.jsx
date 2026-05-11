import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import React from 'react'
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import ForgotPassword from "../features/auth/pages/ForgotPassword"
import ResetPassword from "../features/auth/pages/ResetPassword"
import AdminLayout from "../components/layout/AdminLayout";

// Public Pages
import Home from "../features/public/pages/Home"
import Doctors from "../features/public/pages/Doctors"
import DoctorDetails from "../features/public/pages/DoctorDetails"
import Specialities from "../features/public/pages/Specialities"
import CreateRendezVous from "../features/public/pages/CreateRendezVous"
import Medicaments from "../features/public/pages/Medicaments"
import Dashboard from "../features/admin/dashboard/Dashboard";

export default function AppRoutes() {
    return (

        <Routes>
            {/* {admin dashboard} */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/specialites" element={<Specialities />} />
            <Route path="/createRendezVous" element={<CreateRendezVous />} />
            <Route path="/medicaments" element={<Medicaments />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>

    )
}
