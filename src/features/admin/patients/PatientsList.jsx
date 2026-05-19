import { useEffect, useState } from "react";
import { getPatientsService } from "../services/admin.service";
import { Link } from "react-router-dom";

export default function PatientList() {

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const data = await getPatientsService();
            setPatients(data.data.data); // pagination
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Patients</h1>

            {patients.map((p) => (
                <div key={p.id} style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>

                    <h3>{p.user.name}</h3>
                    <p>{p.user.email}</p>

                    <Link to={`/admin/patients/${p.id}`}>
                        Details
                    </Link>

                </div>
            ))}
        </div>
    );
}