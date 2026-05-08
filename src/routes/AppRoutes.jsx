import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import React from 'react'
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import ForgotPassword from "../features/auth/pages/ForgotPassword"
import ResetPassword from "../features/auth/pages/ResetPassword"


export default function AppRoutes() {
    return (


        <Routes>

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>

    )
}
