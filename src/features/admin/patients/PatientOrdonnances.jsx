import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientOrdonnancesService } from "../services/admin.service";

export default function PatientOrdonnances() {

    const { id } = useParams();
    const [ordonnances, setOrdonnances] = useState([]);

    useEffect(() => {
        loadOrdonnances();
    }, []);

    const loadOrdonnances = async () => {
        try {
            const data = await getPatientOrdonnancesService(id);
            setOrdonnances(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Ordonnances</h1>

            {ordonnances.map((o) => (
                <div key={o.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>

                    <p>Médicament: {o.medicament}</p>
                    <p>Dosage: {o.dosage}</p>
                    <p>Durée: {o.duree}</p>

                </div>
            ))}
        </div>
    );
}