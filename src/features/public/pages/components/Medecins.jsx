import { useEffect, useState } from "react";
import { getMedecinsService } from "../../services/public.service";

// SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// CSS
import "swiper/css";
import "swiper/css/pagination";

function Medecins() {

    const [medecins, setMedecins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMedecins();
    }, []);

    const fetchMedecins = async () => {
        try {

            const response = await getMedecinsService();

            setMedecins(response.data.data.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Loading doctors...
            </div>
        );
    }

    return (
        <section className="py-20 px-6 bg-blue-50 overflow-hidden">

            {/* Header */}
            <div className="text-center mb-14">

                <p className="text-blue-600 font-semibold mb-3">
                    Our Doctors
                </p>

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Meet Our Specialists
                </h1>

                <p className="text-gray-600 max-w-2xl mx-auto">
                    Professional doctors with experience and specialization.
                </p>

            </div>

            {/* SLIDER */}
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1280: {
                        slidesPerView: 4,
                    },
                }}
            >

                {medecins.map((doc) => (

                    <SwiperSlide key={doc.id}>

                        <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-500 p-6 text-center hover:-translate-y-2">

                            {/* Image */}
                            <img
                                src={`http://localhost:8000/${doc.image_medecin}`}
                                alt={doc.user?.name}
                                className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-blue-200 mb-4"
                            />

                            {/* Name */}
                            <h2 className="text-xl font-bold text-gray-800">
                                {doc.user?.name}
                            </h2>

                            {/* Speciality */}
                            <p className="text-blue-600 text-sm mt-1">
                                {doc.specialite?.name}
                            </p>

                            {/* Experience */}
                            <p className="text-gray-600 text-sm mt-3">
                                {doc.annees_experience} years experience
                            </p>

                            <p className="text-gray-500 text-xs mt-1">
                                {doc.user?.address}
                            </p>

                            {/* Button */}
                            <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                                Book Appointment
                            </button>

                        </div>

                    </SwiperSlide>

                ))}

            </Swiper>

        </section>
    );
}

export default Medecins;