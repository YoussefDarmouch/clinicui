import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedecinService } from "../services/admin.service";
import { Link } from "react-router-dom";

export default function MedecinDetails() {

    const { id } = useParams();

    const [medecin, setMedecin] = useState(null);

    useEffect(() => {
        loadMedecin();
    }, []);

    const loadMedecin = async () => {

        try {

            const data = await getMedecinService(id);

            console.log(data.data);

            setMedecin(data.data);

        } catch (error) {
            console.log(error);
        }
    };

    if (!medecin) return <p>Loading...</p>;

    return (

        <div>

            <h1>{medecin.user.name}</h1>

            <p>Email : {medecin.user.email}</p>

            <div>
                <img
                    src={`http://127.0.0.1:8000/${medecin.image_medecin}`}
                    alt="image"
                    width="200"
                />
            </div>

            <p>Numéro licence : {medecin.numero_licence}</p>

            <p>
                Années expérience :
                {medecin.annees_experience}
            </p>

            <p>
                Spécialité :
                {medecin.specialite.name}
            </p>

            <p>
                Description :
                {medecin.specialite.description}
            </p>

            <p>
                Address :
                {medecin.user.address}
            </p>

            <p>
                Téléphone :
                {medecin.user.phone}
            </p>
            <Link to={`/admin/medecins/${medecin.id}/rendezvous`}>
                Rendez-vous
            </Link>

            <Link to={`/admin/medecins/${medecin.id}/consultations`}>
                Consultations
            </Link>

        </div>
    );
}