import { useEffect, useState } from "react";
import { getTemoignagesService } from "../../services/public.service";

// SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// CSS
import "swiper/css";
import "swiper/css/pagination";

function Temoignages() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {

        try {

            const response = await getTemoignagesService();

            setReviews(response.data.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Loading testimonials...
            </div>
        );
    }

    return (
        <section className="py-20 px-6 bg-white overflow-hidden">

            {/* Header */}
            <div className="text-center mb-14">

                <p className="text-blue-600 font-semibold mb-3">
                    Testimonials
                </p>

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    What Our Patients Say
                </h1>

                <p className="text-gray-600 max-w-2xl mx-auto">
                    Real feedback from patients after consultations with our doctors.
                </p>

            </div>

            {/* Slider */}
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }}
            >

                {reviews.map((item) => (

                    <SwiperSlide key={item.id}>

                        <div className="bg-blue-50 rounded-3xl p-7 shadow-md hover:shadow-2xl transition duration-500 h-full">

                            {/* Stars */}
                            <div className="text-yellow-400 mb-4 text-xl">
                                {"⭐".repeat(item.note)}
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 italic mb-6 leading-relaxed min-h-[120px]">
                                "{item.commentaire}"
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t pt-4">

                                {/* Patient */}
                                <div>

                                    <h3 className="font-semibold text-gray-800">
                                        {item.patient?.user?.name}
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        Patient
                                    </p>

                                </div>

                                {/* Doctor */}
                                <div className="text-right">

                                    <p className="text-xs text-gray-500">
                                        Doctor
                                    </p>

                                    <p className="font-semibold text-blue-600 text-sm">
                                        {item.medecin?.user?.name}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </SwiperSlide>

                ))}

            </Swiper>

        </section>
    );
}

export default Temoignages;