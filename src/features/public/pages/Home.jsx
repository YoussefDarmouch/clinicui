import React from 'react'
import Hero from './components/Hero'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'
import Specialities from './components/Specialities'
import Temoignages from './components/Temoignages'
import Medecins from './components/Medecins'
import FAQ from './components/FAQ'
export default function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <Specialities />
            <Medecins />
            <Temoignages />
            <FAQ />
            <Footer />
        </div>
    )
}
