import { useEffect, useState } from "react";
import { getMedecinsService, deleteMedecinService, updateMedecinService } from "../services/admin.service";
import { Link } from "react-router-dom";

export default function MedecinList() {

    const [medecins, setMedecins] = useState([]);

    useEffect(() => {
        loadMedecins();
    }, []);

    const loadMedecins = async () => {
        try {

            const data = await getMedecinsService();

            console.log(data.data.data);

            setMedecins(data.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>

            <h1>Liste des médecins</h1>

            {medecins.map((medecin) => (

                <div key={medecin.id}>

                    <h3>{medecin.user.name}</h3>

                    <p>{medecin.specialite.name}</p>

                    <p>{medecin.numero_licence}</p>

                    <Link to={`/admin/medecins/${medecin.id}`}>
                        Voir détails
                    </Link>

                </div>

            ))}

        </div>
    );
}