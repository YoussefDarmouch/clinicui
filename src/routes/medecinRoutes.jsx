import { Navigate, Route } from "react-router-dom";
import Dashboard from "../features/medecin/dashboard/Dashboard";
import RendezVousList from "../features/medecin/rendezvous/RendezVousList";
import RendezVousDetails from "../features/medecin/rendezvous/RendezVousDetails";
import ConsultationsList from "../features/medecin/consultations/ConsultationsList";
import ConsultationDetails from "../features/medecin/consultations/ConsultationDetails";
import ConsultationForm from "../features/medecin/consultations/ConsultationForm";
import PatientsList from "../features/medecin/patients/PatientsList";
import PatientDetails from "../features/medecin/patients/PatientDetails";
import OrdonnancesList from "../features/medecin/ordonnances/OrdonnancesList";
import OrdonnanceDetails from "../features/medecin/ordonnances/OrdonnanceDetails";
import Profile from "../features/medecin/profile/Profile";
import NotificationsList from "../features/medecin/notifications/NotificationsList";
import Statistics from "../features/medecin/statistics/Statistics";

export default function medecinRoutes() {
    return (
        <>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="rendezvous" element={<RendezVousList />} />
            <Route path="rendezvous/:id" element={<RendezVousDetails />} />

            <Route path="consultations" element={<ConsultationsList />} />
            <Route path="consultations/new" element={<ConsultationForm />} />
            <Route path="consultations/:id" element={<ConsultationDetails />} />
            <Route path="consultations/:id/edit" element={<ConsultationForm />} />

            <Route path="patients" element={<PatientsList />} />
            <Route path="patients/:id" element={<PatientDetails />} />

            <Route path="ordonnances" element={<OrdonnancesList />} />
            <Route path="ordonnances/:id" element={<OrdonnanceDetails />} />

            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<NotificationsList />} />
            <Route path="statistics" element={<Statistics />} />
        </>
    );
}
