import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPatientService } from "../services/admin.service";

export default function PatientDetails() {

    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPatient();
    }, [id]);

    const loadPatient = async () => {

        try {

            setLoading(true);

            const res = await getPatientService(id);

            setPatient(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return <p className="text-center mt-5">Loading...</p>;
    }

    if (!patient) {
        return <p className="text-center mt-5">Patient introuvable</p>;
    }

    return (
        <div className="container mt-4">

            <div className="card shadow-sm p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center">

                    <div>
                        <h2 className="mb-3">{patient.user?.name}</h2>

                        <p>
                            <strong>Email:</strong>
                            {" "}
                            {patient.user?.email}
                        </p>

                        <p>
                            <strong>Téléphone:</strong>
                            {" "}
                            {patient.user?.phone || "Non renseigné"}
                        </p>

                        <p>
                            <strong>Adresse:</strong>
                            {" "}
                            {patient.user?.address || "Non renseignée"}
                        </p>

                        <p>
                            <strong>Sexe:</strong>
                            {" "}
                            {patient.sexe}
                        </p>

                        <p>
                            <strong>Groupe sanguin:</strong>
                            {" "}
                            {patient.groupe_sanguin || "Non renseigné"}
                        </p>
                    </div>

                    <Link
                        to={`/admin/patients`}
                        className="btn btn-secondary"
                    >
                        Retour
                    </Link>

                </div>

            </div>

            {/* DOSSIER MEDICAL */}

            <div className="card shadow-sm p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h3>Dossier médical</h3>

                    {patient.dossier_medical ? (
                        <Link
                            to={`/admin/patients/${id}/dossier-medical`}
                            className="btn btn-primary"
                        >
                            Voir
                        </Link>
                    ) : (
                        <Link
                            to={`/admin/patients/${id}/dossier-medical/create`}
                            className="btn btn-success"
                        >
                            Créer
                        </Link>
                    )}

                </div>

                {patient.dossier_medical ? (

                    <div>

                        <p>
                            <strong>Antécédents médicaux:</strong>
                            {" "}
                            {patient.dossier_medical.antecedents_medicaux || "Aucun"}
                        </p>

                        <p>
                            <strong>Antécédents chirurgicaux:</strong>
                            {" "}
                            {patient.dossier_medical.antecedents_chirurgicaux || "Aucun"}
                        </p>

                        <p>
                            <strong>Traitements actuels:</strong>
                            {" "}
                            {patient.dossier_medical.traitements_actuels || "Aucun"}
                        </p>

                        <p>
                            <strong>Allergies:</strong>
                            {" "}
                            {patient.dossier_medical.allergies_medicamenteux || "Aucune"}
                        </p>

                    </div>

                ) : (

                    <p>Aucun dossier médical disponible</p>

                )}

            </div>

            {/* CONSULTATIONS */}

            <div className="card shadow-sm p-4 mb-4">

                <h3 className="mb-3">
                    Consultations
                    {" "}
                    ({patient.consultations?.length || 0})
                </h3>

                {patient.consultations?.length > 0 ? (

                    patient.consultations.map((consultation) => (

                        <div
                            key={consultation.id}
                            className="border rounded p-3 mb-3"
                        >

                            <p>
                                <strong>Motif:</strong>
                                {" "}
                                {consultation.motif}
                            </p>

                            <p>
                                <strong>Date:</strong>
                                {" "}
                                {consultation.date || "Non définie"}
                            </p>

                        </div>
                    ))

                ) : (

                    <p>Aucune consultation disponible</p>

                )}

            </div>

            {/* RENDEZ-VOUS */}

            <div className="card shadow-sm p-4 mb-4">

                <h3 className="mb-3">
                    Rendez-vous ({patient.rendez_vous?.length || 0})
                </h3>

                {patient.rendez_vous?.length > 0 ? (

                    patient.rendez_vous.map((rdv) => (

                        <div
                            key={rdv.id}
                            className="border rounded p-3 mb-3"
                        >

                            <p>
                                <strong>Date:</strong>
                                {" "}
                                {new Date(rdv.date_heure).toLocaleDateString()}
                            </p>

                            <p>
                                <strong>Heure:</strong>
                                {" "}
                                {new Date(rdv.date_heure).toLocaleTimeString()}
                            </p>

                            <p>
                                <strong>Motif:</strong>
                                {" "}
                                {rdv.motif}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                {" "}
                                {rdv.statut || "En attente"}
                            </p>

                        </div>
                    ))

                ) : (

                    <p>Aucun rendez-vous disponible</p>

                )}

            </div>
            {/* ORDONNANCES */}

            <div className="card shadow-sm p-4 mb-4">

                <h3 className="mb-3">
                    Ordonnances
                    {" "}
                    ({patient.ordonnances?.length || 0})
                </h3>

                {patient.ordonnances?.length > 0 ? (

                    patient.ordonnances.map((ordonnance) => (

                        <div
                            key={ordonnance.id}
                            className="border rounded p-3 mb-3"
                        >

                            <p>
                                <strong>Description:</strong>
                                {" "}
                                {ordonnance.description}
                            </p>

                            <p>
                                <strong>Date:</strong>
                                {" "}
                                {ordonnance.date || "Non définie"}
                            </p>

                        </div>
                    ))

                ) : (

                    <p>Aucune ordonnance disponible</p>

                )}

            </div>

        </div>
    );
}