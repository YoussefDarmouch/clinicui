import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import DossierMedical from "./DossierMedical";
import { PatientService } from "../services/medecin.services";
import { parseError, resolveArray, resolveData } from "../pages/page.utils";

export default function PatientDetails() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [dossier, setDossier] = useState({});
    const [consultations, setConsultations] = useState([]);
    const [rendezvous, setRendezvous] = useState([]);
    const [ordonnances, setOrdonnances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const [patientRes, dossierRes, consultationsRes, rendezvousRes, ordonnancesRes] =
                    await Promise.all([
                        PatientService.getById(id),
                        PatientService.dossier(id),
                        PatientService.consultations(id),
                        PatientService.rendezvous(id),
                        PatientService.ordonnances(id),
                    ]);
                setPatient(resolveData(patientRes));
                setDossier(resolveData(dossierRes) || {});
                setConsultations(resolveArray(consultationsRes));
                setRendezvous(resolveArray(rendezvousRes));
                setOrdonnances(resolveArray(ordonnancesRes));
            } catch (err) {
                setError(parseError(err, "Impossible de charger le dossier patient."));
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <LoadingSpinner text="Chargement du dossier patient..." />;

    if (!patient) {
        return (
            <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">
                Patient introuvable.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            {patient.user?.name || patient.name || "Patient"}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {patient.user?.email || patient.email || "Email non renseigné"}
                        </p>
                    </div>
                    <Link
                        to="/medecin/patients"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                        Retour
                    </Link>
                </div>
                {error ? <p className="mt-3 text-sm text-primary-700">{error}</p> : null}
            </div>

            <DossierMedical
                dossier={dossier}
                consultations={consultations}
                rendezvous={rendezvous}
                ordonnances={ordonnances}
            />
        </div>
    );
}
