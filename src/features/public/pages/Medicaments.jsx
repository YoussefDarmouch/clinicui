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
            setMedicaments(response.data.data);
            setFilteredMedicaments(response.data.data);
        } catch (error) {
            console.error('Error fetching medicaments:', error);
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
            <div>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading medicaments...</p>
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Medicaments</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Browse our comprehensive catalog of medications and healthcare products.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mt-8 max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search medicaments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Medicaments Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredMedicaments.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchTerm ? 'No medicaments found matching your search.' : 'No medicaments available.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMedicaments.map((medicament) => (
                            <div key={medicament.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <div className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {medicament.nom}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {medicament.description || 'Medical product for healthcare needs.'}
                                        </p>
                                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                {medicament.categorie || 'General'}
                                            </span>
                                            {medicament.prix && (
                                                <span className="font-medium text-blue-600">
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