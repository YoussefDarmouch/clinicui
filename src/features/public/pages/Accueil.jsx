import React from 'react'
import Hero from './components/Hero'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'
import Specialites from './components/Specialites'
import Temoignages from './components/Temoignages'
import Medecins from './components/Medecins'
import FAQ from './components/FAQ'
export default function Accueil() {
    return (
        <div className="min-h-screen bg-primary-50">
            <Navbar />
            <Hero />
            <Specialites />
            <Medecins />
            <Temoignages />
            <FAQ />
            <Footer />
        </div>
    )
}
