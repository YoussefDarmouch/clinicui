import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientConsultationsService } from "../services/admin.service";

export default function PatientConsultations() {

    const { id } = useParams();
    const [consultations, setConsultations] = useState([]);

    useEffect(() => {
        loadConsultations();
    }, []);

    const loadConsultations = async () => {
        try {
            const data = await getPatientConsultationsService(id);
            setConsultations(data.data.data); // pagination
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Consultations</h1>

            {consultations.map((c) => (
                <div key={c.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>

                    <p>Date: {new Date(c.date_consultation).toLocaleString()}</p>
                    <p>Diagnostic: {c.diagnostic}</p>
                    <p>Traitement: {c.traitement}</p>

                </div>
            ))}
        </div>
    );
}