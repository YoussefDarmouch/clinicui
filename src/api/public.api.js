import api from "./axios";

export const getMedicaments = () => api.get("/medicaments");
export const getMedecins = () => api.get("/medecins");
// 
export const getMedecinsBySpecialite = (id) =>
    api.get(`/medecins/by-specialite/${id}`);

export const getSpecialites = () => api.get("/specialites");

export const searchMedecinsBySpecialite = (id) =>
    api.get(`/general/medecins-by-specialite/${id}`);

export const getAvailableSlots = (medecin_id, date) =>
    api.get("/general/available-rendezvous", {
        params: { medecin_id, date },
    })
export const getMedecin = (id) => api.get(`/medecins/${id}`);
