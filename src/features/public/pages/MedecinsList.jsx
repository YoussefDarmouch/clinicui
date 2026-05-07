import React, { useEffect, useState } from 'react';
import { getMedecinsService } from '../services/public.service';
import { Link } from 'react-router-dom';

export default function MedecinsList() {
    const [medecins, setMedecins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedecins = async () => {
            try {
                const res = await getMedecinsService();

                // ✔ correct access
                setMedecins(res.data.data.data);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedecins();
    }, []);

    if (loading) {
        return <p className="p-4">Loading...</p>;
    }

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Doctors List
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {medecins.map((doc) => (
                    <div
                        key={doc.id}
                        className="border p-4 rounded shadow"
                    >
                        <h3 className="text-xl font-semibold">
                            Dr. {doc.user?.name}
                        </h3>

                        <p className="text-gray-600">
                            {doc.specialite?.name}
                        </p>

                        <Link
                            to={`/medecins/${doc.id}`}
                            className="text-blue-500 mt-2 inline-block"
                        >
                            View Details →
                        </Link>
                    </div>
                ))}

            </div>

        </div>
    );
}