import { useEffect, useState } from "react";
import { getSpecialitesService } from "../../services/public.service";

function Specialities() {

    const [specialites, setSpecialites] = useState([]);

    useEffect(() => {
        fetchSpecialites();
    }, []);

    const fetchSpecialites = async () => {
        try {
            const response = await getSpecialitesService();

            // IMPORTANT: pagination fix
            setSpecialites(response.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="py-20 px-10 bg-white">

            {/* Header */}
            <div className="text-center mb-14">

                <p className="text-blue-600 font-semibold mb-3">
                    Our Specialities
                </p>

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Medical Specialities
                </h1>

                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our medical departments and connect with specialists.
                </p>

            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {specialites.map((item) => (

                    <div
                        key={item.id}
                        className="bg-blue-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                    >

                        {/* Icon */}
                        <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mb-5">
                            🏥
                        </div>

                        {/* Name */}
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {item.name}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-6">
                            {item.description}
                        </p>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default Specialities;