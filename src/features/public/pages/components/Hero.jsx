import React from 'react'
import doctorImage from "../../../../../public/doctor.png"
function Hero() {
    return (
        <section className="min-h-screen bg-blue-50 flex items-center justify-between px-10 py-16">

            {/* Left Side */}
            <div className="max-w-xl">

                <p className="text-blue-600 font-semibold mb-4">
                    Trusted Healthcare Platform
                </p>

                <h1 className="text-5xl font-bold leading-tight text-gray-800 mb-6">
                    Get trusted medical care anytime, anywhere
                </h1>

                <p className="text-gray-600 text-lg mb-8 leading-8">
                    Connect with professional doctors and specialists
                    for online consultations, appointments, and medical
                    support from the comfort of your home.
                </p>

                {/* Buttons */}
                <div className="flex gap-4">

                    <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                        Book Appointment
                    </button>

                    <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition">
                        Browse Doctors
                    </button>

                </div>

            </div>

            {/* Right Side */}
            <div className="relative">

                {/* Doctor Image */}
                <img
                    src={doctorImage}
                    alt="Doctor"
                    className="w-[450px] object-cover"
                />

                {/* Floating Card 1 */}
                <div className="absolute top-10 -left-10 bg-white shadow-lg rounded-xl px-6 py-4">
                    <h2 className="text-2xl font-bold text-blue-600">
                        95%
                    </h2>

                    <p className="text-gray-600 text-sm">
                        Patient Satisfaction
                    </p>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-10 -right-10 bg-white shadow-lg rounded-xl px-6 py-4">
                    <h2 className="text-2xl font-bold text-green-600">
                        24/7
                    </h2>

                    <p className="text-gray-600 text-sm">
                        Medical Support
                    </p>
                </div>

            </div>

        </section>
    );
}

export default Hero;