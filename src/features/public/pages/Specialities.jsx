import React, { useEffect, useState } from 'react';
import { getSpecialitesService, getMedecinsBySpecialiteService } from '../services/public.service';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

const Specialities = () => {
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorsLoading, setDoctorsLoading] = useState(false);

    useEffect(() => {
        fetchSpecialities();
    }, []);

    const fetchSpecialities = async () => {
        try {
            const response = await getSpecialitesService();
            setSpecialities(response.data.data);
        } catch (error) {
            console.error('Error fetching specialities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSpecialityClick = async (speciality) => {
        setSelectedSpeciality(speciality);
        setDoctorsLoading(true);
        try {
            const response = await getMedecinsBySpecialiteService(speciality.id);
            setDoctors(response.data.data);
            console.log(doctors)
        } catch (error) {
            console.error('Error fetching doctors by speciality:', error);
            setDoctors([]);
        } finally {
            setDoctorsLoading(false);
        }
    };

    const handleBackToSpecialities = () => {
        setSelectedSpeciality(null);
        setDoctors([]);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading specialities...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {selectedSpeciality ? `${selectedSpeciality.nom} Specialists` : 'Medical Specialities'}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {selectedSpeciality
                                ? `Meet our expert doctors specializing in ${selectedSpeciality.name.toLowerCase()}.`
                                : 'Explore our comprehensive range of medical specialities and connect with specialists.'
                            }
                        </p>
                        {selectedSpeciality && (
                            <button
                                onClick={handleBackToSpecialities}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                ← Back to Specialities
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {!selectedSpeciality ? (
                    /* Specialities Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {specialities.map((speciality) => (
                            <div
                                key={speciality.id}
                                onClick={() => handleSpecialityClick(speciality)}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                            >
                                <div className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {speciality.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {speciality.description || 'Specialized medical care and treatment services.'}
                                        </p>
                                        <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                                            View Doctors →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Doctors Grid for Selected Speciality */
                    <div>
                        {doctorsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading doctors...</p>
                            </div>
                        ) : doctors.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No doctors found for this speciality.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {doctors.map((doctor) => (
                                    <div key={doctor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                        <div className="p-6">
                                            <div className="w-24 h-24 mx-auto mb-4">
                                                <img
                                                    src={`http://localhost:8000/${doctor.image_medecin}`}
                                                    alt={`${doctor.name} `}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Dr. {doctor.name}
                                                </h3>
                                                <p className="text-blue-600 font-medium mb-2">
                                                    {doctor.specialite?.name}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {doctor.experience || 'Experienced'} years of experience
                                                </p>
                                                <button
                                                    onClick={() => window.location.href = `/doctors/${doctor.id}`}
                                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Specialities;