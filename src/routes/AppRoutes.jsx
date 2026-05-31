import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import ForgotPassword from "../features/auth/pages/ForgotPassword"
import ResetPassword from "../features/auth/pages/ResetPassword"
import AdminLayout from "../components/layout/AdminLayout";
import MedecinLayout from "../features/medecin/layouts/MedecinLayout";
import PatientLayout from "../features/patient/layouts/PatientLayout";

// Public Pages
import Accueil from "../features/public/pages/Accueil"
import Medecins from "../features/public/pages/Medecins"
import DetailsMedecin from "../features/public/pages/DetailsMedecin"
import Specialites from "../features/public/pages/Specialites"
import CreerRendezVous from "../features/public/pages/CreerRendezVous"
import Medicaments from "../features/public/pages/Medicaments"
import Dashboard from "../features/admin/dashboard/Dashboard";
import UsersList from "../features/admin/users/UsersList";
import UserDetails from "../features/admin/users/UserDetails";
import UserForm from "../features/admin/users/UserForm";
import PatientsList from "../features/admin/patients/PatientsList";
import PatientDetails from "../features/admin/patients/PatientDetails";
import PatientForm from "../features/admin/patients/PatientForm";
import MedecinsList from "../features/admin/medecins/MedecinsList";
import MedecinDetails from "../features/admin/medecins/MedecinDetails";
import MedecinForm from "../features/admin/medecins/MedecinForm";
import Consultations from "../features/admin/medecins/Consultations";
import RendezVous from "../features/admin/medecins/RendezVous";
import Profile from "../features/admin/profile/Profile";
import SpecialitesList from "../features/admin/specialites/SpecialitesList";
import SpecialiteForm from "../features/admin/specialites/SpecialiteForm";
//
import AdminRoute from "./AdminRoute";
import MedecinRoute from "./MedecinRoute";
import PatientRoute from "./PatientRoute";
import medecinRoutes from "./medecinRoutes";
import patientRoutes from "./patientRoutes";
export default function AppRoutes() {
    return (

        <Routes>
            {/* {admin dashboard} */}
            {/* Admin dashboard */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<UsersList />} />
                <Route path="users/new" element={<UserForm />} />
                <Route path="users/:id" element={<UserDetails />} />

                <Route path="patients" element={<PatientsList />} />
                <Route path="patients/new" element={<PatientForm />} />
                <Route path="patients/:id" element={<PatientDetails />} />

                <Route path="medecins" element={<MedecinsList />} />
                <Route path="medecins/new" element={<MedecinForm />} />
                <Route path="medecins/:id" element={<MedecinDetails />} />
                <Route
                    path="medecins/:id/consultations"
                    element={<Consultations />}
                />
                <Route
                    path="medecins/:id/rendezvous"
                    element={<RendezVous />}
                />

                <Route path="profile" element={<Profile />} />
                <Route path="specialites" element={<SpecialitesList />} />
                <Route path="specialites/new" element={<SpecialiteForm />} />
                <Route path="specialites/:id" element={<SpecialiteForm />} />
            </Route>

            <Route
                path="/medecin"
                element={
                    <MedecinRoute>
                        <MedecinLayout />
                    </MedecinRoute>
                }
            >
                {medecinRoutes()}
            </Route>
            <Route
                path="/patient"
                element={
                    <PatientRoute>
                        <PatientLayout />
                    </PatientRoute>
                }
            >
                {patientRoutes()}
            </Route>
            {/* Public Routes */}
            <Route path="/" element={<Accueil />} />
            <Route path="/medecins" element={<Medecins />} />
            <Route path="/medecins/:id" element={<DetailsMedecin />} />
            <Route path="/specialites" element={<Specialites />} />
            <Route path="/creer-rendez-vous" element={<CreerRendezVous />} />
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
