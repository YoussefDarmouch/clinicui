import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { getMedecinsService } from '../services/public.service';
import { createRendezVousService, getAvailableSlotsService as getPatientAvailableSlotsService } from '../../patient/services/patient.services';

const CreerRendezVous = () => {
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

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

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchSlots();
        }
    }, [selectedDoctor, selectedDate]);

    const fetchSlots = async () => {
        setSlotsLoading(true);
        try {
            const res = await getPatientAvailableSlotsService({ medecin_id: selectedDoctor, date: selectedDate });
            setAvailableSlots(res?.data?.data || res?.data || []);
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

    const handleCreateRDV = async () => {
        if (!selectedDoctor || !selectedSlot) {
            alert("Veuillez selectionner un medecin et un horaire.");
            return;
        }

        setBookingLoading(true);

        try {
            const payload = {
                medecin_id: selectedDoctor,
                date_heure: selectedSlot,
                motif: form.motif,
                notes: form.notes
            };

            await createRendezVousService(payload);

            alert("Rendez-vous créé avec succès!");

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
            <div className="min-h-screen bg-primary-50">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center px-4 py-12 text-slate-600">
                    Chargement...
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50">
            <Navbar />

            <div className="text-center p-8 bg-primary-50 border-b border-primary-200">
                <h1 className="text-3xl font-bold text-slate-900">Créer Rendez-vous</h1>
            </div>

            <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="font-bold mb-4">Choisir Médecin</h2>

                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full p-3 border border-primary-200 rounded-xl mb-4 bg-white focus:ring-2 focus:ring-primary-500/20"
                    >
                        <option value="">Selectionner un medecin</option>
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
                        className="w-full p-3 border border-primary-200 rounded-xl mb-4 bg-white focus:ring-2 focus:ring-primary-500/20"
                    />

                    <div className="grid grid-cols-3 gap-2">
                        {slotsLoading ? (
                            <p className="text-slate-600">Chargement des creneaux...</p>
                        ) : (
                            availableSlots.map((slot, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-3 rounded-xl border border-primary-200 text-sm font-medium transition ${selectedSlot === slot ? 'bg-primary-600 text-white' : 'bg-white hover:bg-primary-50 text-slate-700'}`}
                                >
                                    {slot}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="font-bold mb-4">Détails</h2>

                    <input
                        name="motif"
                        placeholder="Motif"
                        value={form.motif}
                        onChange={handleChange}
                        className="w-full p-3 border border-primary-200 rounded-xl mb-3 bg-white focus:ring-2 focus:ring-primary-500/20"
                    />

                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full p-3 border border-primary-200 rounded-xl mb-3 bg-white focus:ring-2 focus:ring-primary-500/20"
                    />

                    <button
                        onClick={handleCreateRDV}
                        disabled={bookingLoading}
                        className="w-full bg-primary-600 text-white p-3 rounded"
                    >
                        {bookingLoading ? "Création..." : "Créer Rendez-vous"}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreerRendezVous;
