import React, { useEffect, useMemo, useState } from 'react';
import { getMedecinsService } from '../services/public.service';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpeciality, setSelectedSpeciality] = useState('');

    const navigate = useNavigate();



    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await getMedecinsService();

            const doctorsData =
                response?.data?.data?.data || [];

            setDoctors(doctorsData);

        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    // unique specialities
    const specialities = useMemo(() => {
        const unique = [];

        doctors.forEach((doctor) => {
            const s = doctor.specialite;

            if (s && !unique.find((x) => x.id === s.id)) {
                unique.push(s);
            }
        });

        return unique;
    }, [doctors]);

    // filter doctors
    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const name = (doctor.user?.name || '').toLowerCase();
            const speciality = (doctor.specialite?.name || '').toLowerCase();
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                name.includes(search) ||
                speciality.includes(search);

            const matchesSpeciality =
                !selectedSpeciality ||
                doctor.specialite?.id === Number(selectedSpeciality);

            return matchesSearch && matchesSpeciality;
        });
    }, [doctors, searchTerm, selectedSpeciality]);



    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading doctors...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* HEADER */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Our Doctors
                    </h1>

                    <p className="text-gray-600">
                        Find and book appointments with top specialists
                    </p>

                    {/* SEARCH */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">

                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="flex-1 px-4 py-3 border rounded-lg"
                        />

                        <select
                            value={selectedSpeciality}
                            onChange={(e) =>
                                setSelectedSpeciality(e.target.value)
                            }
                            className="px-4 py-3 border rounded-lg"
                        >
                            <option value="">
                                All Specialities
                            </option>

                            {specialities.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                {filteredDoctors.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No doctors found
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                            >
                                {/* IMAGE */}
                                <img
                                    src={`http://localhost:8000/${doctor.image_medecin}`}
                                    alt={doctor.user?.name}
                                    className="w-24 h-24 mx-auto rounded-full object-cover"
                                />

                                {/* NAME */}
                                <h3 className="text-center mt-4 font-semibold">
                                    {doctor.user?.name}
                                </h3>

                                {/* SPECIALITY */}
                                <p className="text-center text-blue-600">
                                    {doctor.specialite?.name}
                                </p>

                                {/* EXPERIENCE */}
                                <p className="text-center text-sm text-gray-500 mt-1">
                                    {doctor.annees_experience} years experience
                                </p>

                                {/* BUTTON */}
                                <button
                                    onClick={() =>
                                        navigate(`/doctors/${doctor.id}`)
                                    }
                                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                >
                                    View Profile
                                </button>

                            </div>
                        ))}

                    </div>
                )}

            </div>

            <Footer />
        </div>
    );
};

export default Doctors;