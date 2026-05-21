import React, { useEffect, useState } from 'react';
import { getSpecialitesService, getMedecinsBySpecialiteService } from '../services/public.service';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

const Specialites = () => {
    const [specialites, setSpecialites] = useState([]);
    const [selectedSpecialite, setSelectedSpecialite] = useState(null);
    const [medecins, setMedecins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [medecinsLoading, setMedecinsLoading] = useState(false);

    useEffect(() => {
        fetchSpecialites();
    }, []);

    const fetchSpecialites = async () => {
        try {
            const response = await getSpecialitesService();
            setSpecialites(response.data.data);
        } catch (error) {
            console.error('Erreur lors du chargement des specialites :', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSpecialiteClick = async (specialite) => {
        setSelectedSpecialite(specialite);
        setMedecinsLoading(true);

        try {
            const response = await getMedecinsBySpecialiteService(specialite.id);
            setMedecins(response.data.data.data);
        } catch (error) {
            console.error('Erreur lors du chargement des medecins par specialite :', error);
            setMedecins([]);
        } finally {
            setMedecinsLoading(false);
        }
    };

    const handleRetourSpecialites = () => {
        setSelectedSpecialite(null);
        setMedecins([]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-50">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center px-4 py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600">Chargement des specialites...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50">
            <Navbar />

            {/* Header */}
            <div className="bg-primary-50 border-b border-primary-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            {selectedSpecialite ? `${selectedSpecialite.name} - Medecins` : 'Specialites medicales'}
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {selectedSpecialite
                                ? `Decouvrez nos medecins experts en ${selectedSpecialite.name.toLowerCase()}.`
                                : 'Explorez toutes nos specialites medicales et trouvez le specialiste adapte a vos besoins.'
                            }
                        </p>
                        {selectedSpecialite && (
                            <button
                                onClick={handleRetourSpecialites}
                                className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition"
                            >
                                ? Retour aux specialites
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {!selectedSpecialite ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {specialites.map((specialite) => (
                            <div
                                key={specialite.id}
                                onClick={() => handleSpecialiteClick(specialite)}
                                className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group border border-primary-100"
                            >
                                <div className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                            {specialite.name}
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-4">
                                            {specialite.description || 'Prise en charge et traitements specialises.'}
                                        </p>
                                        <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                                            Voir les medecins ?
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {medecinsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-slate-600">Chargement des medecins...</p>
                            </div>
                        ) : medecins.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg">Aucun medecin trouve pour cette specialite.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {medecins.map((medecin) => (
                                    <div key={medecin.id} className="bg-white/95 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-primary-100">
                                        <div className="p-6">
                                            <div className="w-24 h-24 mx-auto mb-4">
                                                <img
                                                    src={`http://localhost:8000/${medecin.image_medecin}`}
                                                    alt={medecin.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    Dr. {medecin.name}
                                                </h3>
                                                <p className="text-primary-600 font-medium mb-2">
                                                    {medecin.specialite?.name}
                                                </p>
                                                <p className="text-sm text-slate-600 mb-4">
                                                    {medecin.experience || 'Experimente'} ans d'experience
                                                </p>
                                                <button
                                                    onClick={() => window.location.href = `/medecins/${medecin.id}`}
                                                    className="w-full bg-primary-600 text-white py-3 rounded-full hover:bg-primary-700 transition-colors"
                                                >
                                                    Voir le profil
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

export default Specialites;
