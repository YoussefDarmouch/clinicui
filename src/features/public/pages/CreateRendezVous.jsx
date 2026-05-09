import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { getMedecinsService, getAvailableSlotsService } from '../services/public.service';
import { createRendezVous } from '../../../api/patient.api';

const CreateRendezVous = () => {

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [form, setForm] = useState({
        motif: '',
        notes: ''
    });

    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const navigate = useNavigate();

    // 🔐 auth check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, []);

    // 📥 load doctors
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await getMedecinsService();
            const doctorsData = response?.data?.data?.data || [];
            setDoctors(doctorsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 📅 load slots
    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchSlots();
        }
    }, [selectedDoctor, selectedDate]);

    const fetchSlots = async () => {
        setSlotsLoading(true);
        try {
            const res = await getAvailableSlotsService(selectedDoctor, selectedDate);

            // 🔥 IMPORTANT: slots are strings
            setAvailableSlots(res.data.data || []);
            setSelectedSlot(null);

        } catch (err) {
            console.error(err);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // 🚀 CREATE RDV
    const handleCreateRDV = async () => {

        if (!selectedDoctor || !selectedSlot) {
            alert("Please select doctor and time");
            return;
        }

        setBookingLoading(true);

        try {
            const payload = {
                medecin_id: selectedDoctor,
                date_heure: selectedSlot, // ✅ FIXED
                motif: form.motif,
                notes: form.notes
            };

            await createRendezVous(payload);

            alert("Rendez-vous créé avec succès!");

            // reset
            setSelectedDoctor('');
            setSelectedSlot(null);
            setAvailableSlots([]);
            setForm({ motif: '', notes: '' });

        } catch (error) {
            console.error(error);
            alert("Erreur lors de la création du rendez-vous");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    Loading...
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="text-center p-8 bg-white shadow">
                <h1 className="text-3xl font-bold">Créer Rendez-vous</h1>
            </div>

            <div className="max-w-5xl mx-auto p-6 grid grid-cols-2 gap-8">

                {/* LEFT */}
                <div>
                    <h2 className="font-bold mb-4">Choisir Médecin</h2>

                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full p-2 border mb-4"
                    >
                        <option value="">Select doctor</option>
                        {doctors.map(doc => (
                            <option key={doc.id} value={doc.id}>
                                Dr {doc.user.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border mb-4"
                    />

                    {/* SLOTS */}
                    <div className="grid grid-cols-3 gap-2">
                        {slotsLoading ? (
                            <p>Loading slots...</p>
                        ) : (
                            availableSlots.map((slot, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-2 border rounded ${selectedSlot === slot ? 'bg-blue-600 text-white' : ''
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div>
                    <h2 className="font-bold mb-4">Détails</h2>

                    <input
                        name="motif"
                        placeholder="Motif"
                        value={form.motif}
                        onChange={handleChange}
                        className="w-full p-2 border mb-3"
                    />

                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full p-2 border mb-3"
                    />

                    <button
                        onClick={handleCreateRDV}
                        disabled={bookingLoading}
                        className="w-full bg-blue-600 text-white p-3 rounded"
                    >
                        {bookingLoading ? "Création..." : "Créer Rendez-vous"}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreateRendezVous;