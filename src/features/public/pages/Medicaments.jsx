import React, { useEffect, useState } from 'react';
import { getMedicamentsService } from '../services/public.service';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

const Medicaments = () => {
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMedicaments, setFilteredMedicaments] = useState([]);

    useEffect(() => {
        fetchMedicaments();
    }, []);

    useEffect(() => {
        filterMedicaments();
    }, [medicaments, searchTerm]);

    const fetchMedicaments = async () => {
        try {
            const response = await getMedicamentsService();
            setMedicaments(response.data.data.data);
            console.log(response.data.data.data);
            setFilteredMedicaments(response.data.data.data);
        } catch (error) {
            console.error('Erreur lors du chargement des medicaments :', error);
        } finally {
            setLoading(false);
        }
    };

    const filterMedicaments = () => {
        if (searchTerm) {
            const filtered = medicaments.filter(medicament =>
                medicament.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                medicament.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMedicaments(filtered);
        } else {
            setFilteredMedicaments(medicaments);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-50">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center px-4 py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600">Chargement des medicaments...</p>
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
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Medicaments</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Parcourez notre catalogue complet de medicaments et de produits de sante.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mt-8 max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Rechercher un medicament..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-primary-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Medicaments Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredMedicaments.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg">
                            {searchTerm ? 'Aucun medicament ne correspond a votre recherche.' : 'Aucun medicament disponible.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMedicaments.map((medicament) => (
                            <div key={medicament.id} className="bg-primary-50 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-primary-100">
                                <div className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                            {medicament.nom}
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-4">
                                            {medicament.description || 'Produit medical pour les besoins de sante.'}
                                        </p>
                                        <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
                                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                                {medicament.categorie || 'General'}
                                            </span>
                                            {medicament.prix && (
                                                <span className="font-medium text-primary-700">
                                                    ${medicament.prix}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Medicaments;


