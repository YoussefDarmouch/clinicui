import React, { useEffect, useState } from "react";
import { getMedicamentsService } from "../services/public.service";

export default function Medicaments() {
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicaments = async () => {
            try {
                const res = await getMedicamentsService();
                setMedicaments(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicaments();
    }, []);

    if (loading) {
        return <p className="p-4">Loading...</p>;
    }

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Medicaments List
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {medicaments.map((med) => (
                    <div
                        key={med.id}
                        className="border p-4 rounded shadow"
                    >
                        <h3 className="text-xl font-semibold">
                            {med.name}
                        </h3>

                        <p className="text-gray-600">
                            {med.description}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Price: {med.price} DH
                        </p>

                    </div>
                ))}

            </div>

        </div>
    );
}