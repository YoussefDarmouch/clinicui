import { Navigate, Route } from "react-router-dom";
import Dashboard from "../features/patient/pages/dashboard/Dashboard";
import RendezVousList from "../features/patient/pages/rendezvous/RendezVousList";
import RendezVousDetails from "../features/patient/pages/rendezvous/RendezVousDetails";
import RendezVousForm from "../features/patient/pages/rendezvous/RendezVousForm";
import DossierMedical from "../features/patient/pages/dossier-medical/DossierMedical";
import DossierMedicalDetails from "../features/patient/pages/dossier-medical/DossierMedicalDetails";
import ConsultationsList from "../features/patient/pages/consultations/ConsultationsList";
import ConsultationDetails from "../features/patient/pages/consultations/ConsultationDetails";
import OrdonnancesList from "../features/patient/pages/ordonnances/OrdonnancesList";
import OrdonnanceDetails from "../features/patient/pages/ordonnances/OrdonnanceDetails";
import Profile from "../features/patient/pages/profile/Profile";
import Statistics from "../features/patient/pages/statistics/Statistics";

export default function patientRoutes() {
    return (
        <>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="rendezvous" element={<RendezVousList />} />
            <Route path="rendezvous/new" element={<RendezVousForm />} />
            <Route path="rendezvous/:id" element={<RendezVousDetails />} />
            <Route path="rendezvous/:id/edit" element={<RendezVousForm />} />

            <Route path="dossier-medical" element={<DossierMedical />} />
            <Route path="dossier-medical/:id" element={<DossierMedicalDetails />} />

            <Route path="consultations" element={<ConsultationsList />} />
            <Route path="consultations/:id" element={<ConsultationDetails />} />

            <Route path="ordonnances" element={<OrdonnancesList />} />
            <Route path="ordonnances/:id" element={<OrdonnanceDetails />} />

            <Route path="profile" element={<Profile />} />
            <Route path="statistics" element={<Statistics />} />
        </>
    );
}
