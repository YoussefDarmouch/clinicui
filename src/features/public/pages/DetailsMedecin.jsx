import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
    getMedecinService,
    getAvailableSlotsService
} from '../services/public.service';

import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

const DetailsMedecin = () => {
    const { id } = useParams();

    const [medecin, setMedecin] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(today);

    useEffect(() => {
        fetchMedecin();
    }, [id]);

    useEffect(() => {
        if (medecin?.id) {
            fetchAvailableSlots();
        }
    }, [medecin, selectedDate]);

    const fetchMedecin = async () => {
        try {
            setLoading(true);

            const response = await getMedecinService(id);

            setMedecin(response.data.data);
        } catch (error) {
            console.error('Erreur lors du chargement du medecin :', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            setSlotsLoading(true);

            const response = await getAvailableSlotsService(
                medecin.id,
                selectedDate
            );

            setAvailableSlots(response.data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des creneaux :', error);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handlePrendreRendezVous = (slot) => {
        alert(`Reservation du creneau ${slot}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-50">
                <Navbar />

                <div className="min-h-screen flex items-center justify-center px-4 py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>

                        <p className="mt-4 text-slate-600">
                            Chargement des details du medecin...
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    if (!medecin) {
        return (
            <div className="min-h-screen bg-primary-50">
                <Navbar />

                <div className="min-h-screen flex items-center justify-center px-4 py-12">
                    <p className="text-slate-500 text-lg">
                        Medecin introuvable
                    </p>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50">
            <Navbar />

            {/* HEADER */}
            <div className="bg-primary-50 border-b border-primary-200">
                <div className="max-w-7xl mx-auto px-4 py-12">

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                        {/* IMAGE */}
                        <div className="w-48 h-48">
                            <img
                                src={
                                    medecin.image_medecin
                                        ? `http://127.0.0.1:8000/${medecin.image_medecin}`
                                        : '/default-doctor.png'
                                }
                                alt={medecin.user?.name}
                                className="w-full h-full object-cover rounded-full border-4 border-primary-100"
                            />
                        </div>

                        {/* INFO */}
                        <div className="flex-1 text-center md:text-left">

                            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                {medecin.user?.name}
                            </h1>

                            <p className="text-xl text-primary-600 font-medium mb-6">
                                {medecin.specialite?.name}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* EXPERIENCE */}
                                <div className="bg-primary-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {medecin.annees_experience}
                                    </div>

                                    <div className="text-sm text-slate-600">
                                        Annees d'experience
                                    </div>
                                </div>

                                {/* PHONE */}
                                <div className="bg-primary-50 p-4 rounded-lg">
                                    <div className="text-lg font-bold text-primary-600">
                                        {medecin.user?.phone}
                                    </div>

                                    <div className="text-sm text-slate-600">
                                        Telephone
                                    </div>
                                </div>

                                {/* ADDRESS */}
                                <div className="bg-primary-50 p-4 rounded-lg">
                                    <div className="text-lg font-bold text-primary-600">
                                        {medecin.user?.address}
                                    </div>

                                    <div className="text-sm text-slate-600">
                                        Adresse
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

                        <div className="bg-white/95 rounded-3xl shadow-sm p-6 border border-primary-100">

                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                A propos du medecin
                            </h2>

                            <p className="text-slate-600 leading-relaxed">
                                Specialiste en{' '}
                                <span className="font-semibold">
                                    {medecin.specialite?.name}
                                </span>{' '}
                                avec{' '}
                                <span className="font-semibold">
                                    {medecin.annees_experience} ans
                                </span>{' '}
                                d'experience.
                            </p>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div>

                        <div className="bg-white/95 rounded-3xl shadow-sm p-6 border border-primary-100 sticky top-6">

                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Prendre rendez-vous
                            </h2>

                            {/* DATE */}
                            <div className="mb-6">

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Choisir une date
                                </label>

                                <input
                                    type="date"
                                    value={selectedDate}
                                    min={today}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-primary-200 rounded-md bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                />

                            </div>

                            {/* SLOTS */}
                            <div>

                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                    Creneaux disponibles
                                </h3>

                                {slotsLoading ? (
                                    <div className="text-center py-4">

                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>

                                        <p className="text-sm text-slate-600 mt-2">
                                            Chargement des creneaux...
                                        </p>

                                    </div>
                                ) : availableSlots.length === 0 ? (
                                    <p className="text-slate-500 text-sm">
                                        Aucun creneau disponible pour cette date.
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">

                                        {availableSlots.map((slot) => {
                                            const time = slot.split(' ')[1];

                                            return (
                                                <button
                                                    key={slot}
                                                    onClick={() =>
                                                        handlePrendreRendezVous(slot)
                                                    }
                                                    className="w-full text-left px-4 py-3 border border-primary-200 rounded-xl bg-white hover:bg-primary-50 hover:border-primary-700 transition"
                                                >
                                                    <div className="font-semibold text-slate-900">
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

export default DetailsMedecin;



