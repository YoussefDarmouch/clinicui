import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedecinService } from "../services/public.service";

export default function MedecinDetails() {
    const { id } = useParams();

    const [medecin, setMedecin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedecin = async () => {
            try {
                const data = await getMedecinService(id);
                setMedecin(data.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedecin();
    }, [id]);

    if (loading) {
        return <p className="p-4">Loading...</p>;
    }

    if (!medecin) {
        return <p className="p-4 text-red-500">Doctor not found</p>;
    }

    const { user, specialite } = medecin;

    return (
        <div className="p-6 max-w-2xl mx-auto border rounded shadow">

            <h1 className="text-3xl font-bold mb-4">
                Dr. {user?.name}
            </h1>

            <p className="mb-2">
                <strong>Speciality:</strong> {specialite?.name}
            </p>

            <p className="mb-2">
                <strong>Phone:</strong> {user?.phone}
            </p>

            <p className="mb-2">
                <strong>Email:</strong> {user?.email}
            </p>

            <p className="mb-2">
                <strong>Address:</strong> {user?.address}
            </p>

            <p className="mb-2">
                <strong>Licence:</strong> {medecin.numero_licence}
            </p>

            <p className="mb-2">
                <strong>Experience:</strong> {medecin.annees_experience} years
            </p>

        </div>
    );
}