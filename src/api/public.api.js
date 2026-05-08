import api from "./axios";

// =====================
// Medicaments
// =====================
export const getMedicaments = () => api.get("/medicaments");

// =====================
// Medecins
// =====================
export const getMedecins = () => api.get("/medecins");
export const getMedecin = (id) => api.get(`/medecins/${id}`);
export const getMedecinsBySpecialite = (id) => api.get(`/medecins/by-specialite/${id}`);
export const searchMedecinsBySpecialite = (id) => api.get(`/general/medecins-by-specialite/${id}`);

// =====================
// Specialites
// =====================
export const getSpecialites = () => api.get("/specialites");
export const getSpecialite = (id) => api.get(`/specialites/${id}`);

// =====================
// Rendez-vous
// =====================
export const getAvailableSlots = (medecin_id, date) =>
    api.get("/general/available-rendezvous", {
        params: { medecin_id, date },
    });

// =====================
// Temoignages
// =====================
export const getTemoignages = () => api.get("/temoignages");