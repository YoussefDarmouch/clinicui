import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDossierMedicalService } from "../services/admin.service";

export default function DossierMedical() {

    const { id } = useParams();
    const [dossier, setDossier] = useState(null);

    useEffect(() => {
        loadDossier();
    }, []);

    const loadDossier = async () => {
        try {
            const data = await getDossierMedicalService(id);
            setDossier(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!dossier) return <p>Loading...</p>;

    return (
        <div>
            <h1>Dossier Médical</h1>

            <p>Patient ID: {dossier.patient_id}</p>
            <p>Allergies: {dossier.allergies}</p>
            <p>Groupe sanguin: {dossier.groupe_sanguin}</p>
            <p>Historique: {dossier.historique}</p>
        </div>
    );
}