import {
    getMedicaments,
    getMedecins,
    getMedecin,
    getMedecinsBySpecialite,
    searchMedecinsBySpecialite,
    getSpecialites,
    getSpecialite,
    getAvailableSlots,
    getTemoignages
} from "../../../api/public.api";

// =====================
// Medicaments
// =====================
export const getMedicamentsService = () => getMedicaments();

// =====================
// Medecins
// =====================
export const getMedecinsService = () => getMedecins();

export const getMedecinService = (id) => getMedecin(id);

export const getMedecinsBySpecialiteService = (id) =>
    getMedecinsBySpecialite(id);

export const searchMedecinsBySpecialiteService = (id) =>
    searchMedecinsBySpecialite(id);

// =====================
// Specialites
// =====================
export const getSpecialitesService = () => getSpecialites();

export const getSpecialiteService = (id) => getSpecialite(id);

// =====================
// Rendez-vous
// =====================
export const getAvailableSlotsService = (medecin_id, date) =>
    getAvailableSlots(medecin_id, date);

// =====================
// Temoignages
// =====================
export const getTemoignagesService = () => getTemoignages();