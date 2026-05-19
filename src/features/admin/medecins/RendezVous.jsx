import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedecinRendezVousService } from "../services/admin.service";

export default function RendezVous() {

    const { id } = useParams();

    const [rendezVous, setRendezVous] = useState([]);

    useEffect(() => {
        loadRendezVous();
    }, []);

    const loadRendezVous = async () => {

        try {

            const data = await getMedecinRendezVousService(id);

            console.log(data.data.data);

            setRendezVous(data.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div>

            <h1>Rendez-vous</h1>

            {rendezVous.map((rdv) => (

                <div
                    key={rdv.id}
                    style={{
                        border: "1px solid gray",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >

                    <h3>
                        Patient :
                        {rdv.patient.user.name}
                    </h3>

                    <p>
                        Date :
                        {
                            new Date(
                                rdv.date_heure
                            ).toLocaleDateString()
                        }
                    </p>

                    <p>
                        Heure :
                        {
                            new Date(
                                rdv.date_heure
                            ).toLocaleTimeString()
                        }
                    </p>

                    <p>
                        Motif :
                        {rdv.motif}
                    </p>

                    <p>
                        Statut :
                        {rdv.statut}
                    </p>

                    <p>
                        Téléphone :
                        {rdv.patient.user.phone}
                    </p>

                    <p>
                        Address :
                        {rdv.patient.user.address}
                    </p>

                    <p>
                        Sexe :
                        {rdv.patient.sexe}
                    </p>

                </div>

            ))}

        </div>
    );
}