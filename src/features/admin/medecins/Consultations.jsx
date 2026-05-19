import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedecinConsultationsService } from "../services/admin.service";

export default function Consultations() {

    const { id } = useParams();

    const [consultations, setConsultations] = useState([]);

    useEffect(() => {
        loadConsultations();
    }, []);

    const loadConsultations = async () => {

        try {

            const data = await getMedecinConsultationsService(id);

            console.log(data.data.data);

            setConsultations(data.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div>

            <h1>Consultations</h1>

            {consultations.map((consultation) => (

                <div
                    key={consultation.id}
                    style={{
                        border: "1px solid gray",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >

                    <h3>
                        Patient :
                        {consultation.patient.user.name}
                    </h3>

                    <p>
                        Date consultation :
                        {
                            new Date(
                                consultation.date_consultation
                            ).toLocaleDateString()
                        }
                    </p>

                    <p>
                        Heure :
                        {
                            new Date(
                                consultation.date_consultation
                            ).toLocaleTimeString()
                        }
                    </p>

                    <p>
                        Diagnostic :
                        {consultation.diagnostic}
                    </p>

                    <p>
                        Traitement :
                        {consultation.traitement}
                    </p>

                    <p>
                        Température :
                        {consultation.temperature}
                    </p>

                    <p>
                        Tension :
                        {consultation.tension}
                    </p>

                    <p>
                        Poids :
                        {consultation.poids} kg
                    </p>

                    <p>
                        Motif rendez-vous :
                        {consultation.rendez_vous.motif}
                    </p>

                    <p>
                        Statut :
                        {consultation.rendez_vous.statut}
                    </p>

                </div>

            ))}

        </div>
    );
}