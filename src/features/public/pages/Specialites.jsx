import React, { useEffect, useState } from "react";
import { getSpecialitesService } from "../services/public.service";

export default function Specialites() {
    const [specialites, setSpecialites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecialites = async () => {
            try {
                const res = await getSpecialitesService();
                setSpecialites(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialites();
    }, []);

    if (loading) {
        return <p className="p-4">Loading...</p>;
    }

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Specialities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {specialites.map((sp) => (
                    <div
                        key={sp.id}
                        className="border p-4 rounded shadow"
                    >
                        <h3 className="text-xl font-semibold">
                            {sp.name}
                        </h3>

                        <p className="text-gray-600">
                            {sp.description}
                        </p>

                    </div>
                ))}

            </div>

        </div>
    );
}