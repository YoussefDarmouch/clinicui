import React from 'react'
import doctorImage from "../../../../../public/doctor.png"
function Hero() {
    return (
        <section className="min-h-screen bg-primary-50 flex items-center justify-between px-10 py-16">

            {/* Left Side */}
            <div className="max-w-xl">

                <p className="text-primary-600 font-semibold mb-4">
                    Plateforme de sante de confiance
                </p>

                <h1 className="text-5xl font-bold leading-tight text-slate-900 mb-6">
                    Recevez des soins medicaux fiables, partout et a tout moment
                </h1>

                <p className="text-slate-600 text-lg mb-8 leading-8">
                    Connectez-vous a des medecins et specialistes qualifies
                    pour des consultations en ligne, des rendez-vous et un
                    accompagnement medical sans quitter votre domicile.
                </p>

                {/* Buttons */}
                <div className="flex gap-4">

                    <button className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition">
                        Prendre rendez-vous
                    </button>

                    <button className="border border-primary-600 text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-100 transition">
                        Voir les medecins
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
                <div className="absolute top-10 -left-10 bg-white/95 border border-primary-100 shadow-lg rounded-3xl px-6 py-4">
                    <h2 className="text-2xl font-bold text-primary-600">
                        95%
                    </h2>

                    <p className="text-slate-600 text-sm">
                        Satisfaction patients
                    </p>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-10 -right-10 bg-white/95 border border-primary-100 shadow-lg rounded-3xl px-6 py-4">
                    <h2 className="text-2xl font-bold text-primary-600">
                        24/7
                    </h2>

                    <p className="text-slate-600 text-sm">
                        Assistance medicale
                    </p>
                </div>

            </div>

        </section>
    );
}

export default Hero;

