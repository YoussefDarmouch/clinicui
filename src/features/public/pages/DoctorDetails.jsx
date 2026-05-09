import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
    getMedecinService,
    getAvailableSlotsService
} from '../services/public.service';

import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

const DoctorDetails = () => {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(today);

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    useEffect(() => {
        if (doctor?.id) {
            fetchAvailableSlots();
        }
    }, [doctor, selectedDate]);

    const fetchDoctor = async () => {
        try {
            setLoading(true);

            const response = await getMedecinService(id);

            setDoctor(response.data.data);
        } catch (error) {
            console.error('Error fetching doctor:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            setSlotsLoading(true);

            const response = await getAvailableSlotsService(
                doctor.id,
                selectedDate
            );

            setAvailableSlots(response.data.data || []);
        } catch (error) {
            console.error('Error fetching slots:', error);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleBookAppointment = (slot) => {
        alert(`Booking appointment at ${slot}`);
    };

    if (loading) {
        return (
            <div>
                <Navbar />

                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>

                        <p className="mt-4 text-gray-600">
                            Loading doctor details...
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div>
                <Navbar />

                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500 text-lg">
                        Doctor not found
                    </p>
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
                <div className="max-w-7xl mx-auto px-4 py-12">

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                        {/* IMAGE */}
                        <div className="w-48 h-48">
                            <img
                                src={
                                    doctor.image_medecin
                                        ? `http://127.0.0.1:8000/${doctor.image_medecin}`
                                        : '/default-doctor.png'
                                }
                                alt={doctor.user?.name}
                                className="w-full h-full object-cover rounded-full border-4 border-blue-100"
                            />
                        </div>

                        {/* INFO */}
                        <div className="flex-1 text-center md:text-left">

                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {doctor.user?.name}
                            </h1>

                            <p className="text-xl text-blue-600 font-medium mb-6">
                                {doctor.specialite?.name}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* EXPERIENCE */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {doctor.annees_experience}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Years Experience
                                    </div>
                                </div>

                                {/* PHONE */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">
                                        {doctor.user?.phone}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Phone Number
                                    </div>
                                </div>

                                {/* ADDRESS */}
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-lg font-bold text-purple-600">
                                        {doctor.user?.address}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Address
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

            {/* MAIN */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2">

                        <div className="bg-white rounded-lg shadow-md p-6">

                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                About Doctor
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                Specialist in{' '}
                                <span className="font-semibold">
                                    {doctor.specialite?.name}
                                </span>{' '}
                                with{' '}
                                <span className="font-semibold">
                                    {doctor.annees_experience} years
                                </span>{' '}
                                of experience.
                            </p>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div>

                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Book Appointment
                            </h2>

                            {/* DATE */}
                            <div className="mb-6">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>

                                <input
                                    type="date"
                                    value={selectedDate}
                                    min={today}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* SLOTS */}
                            <div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Available Times
                                </h3>

                                {slotsLoading ? (
                                    <div className="text-center py-4">

                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>

                                        <p className="text-sm text-gray-600 mt-2">
                                            Loading slots...
                                        </p>

                                    </div>
                                ) : availableSlots.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        No available slots for this date.
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">

                                        {availableSlots.map((slot) => {
                                            const time = slot.split(' ')[1];

                                            return (
                                                <button
                                                    key={slot}
                                                    onClick={() =>
                                                        handleBookAppointment(slot)
                                                    }
                                                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
                                                >
                                                    <div className="font-semibold text-gray-900">
                                                        {time}
                                                    </div>
                                                </button>
                                            );
                                        })}

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
};

export default DoctorDetails;