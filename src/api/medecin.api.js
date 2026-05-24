import api from "./axios";
// CONSULTATIONS

export const getConsultations = () =>
    api.get("/medecin/consultations");

export const getConsultation = (id) =>
    api.get(`/medecin/consultations/${id}`);

export const createConsultation = (data) =>
    api.post("/medecin/consultations", data);

export const updateConsultation = (id, data) =>
    api.put(`/medecin/consultations/${id}`, data);

export const deleteConsultation = (id) =>
    api.delete(`/medecin/consultations/${id}`);

// ORDONNANCES (nested)

export const createOrdonnance = (consultationId, data) =>
    api.post(`/medecin/consultations/${consultationId}/ordonnances`, data);

export const getOrdonnance = (ordonnanceId) =>
    api.get(`/medecin/ordonnances/${ordonnanceId}`);
export const getOrdonnances = () =>
    api.get(`/medecin/ordonnances`);

// get medicaments of ordonnance

export const getOrdonnanceMedicaments = (ordonnanceId) =>
    api.get(`/medecin/ordonnances/${ordonnanceId}/medicaments`);

// RENDEZ-VOUS

export const getRendezVous = () =>
    api.get("/medecin/rendezvous");

export const getAvailableRendezVous = () =>
    api.get("/medecin/rendezvous/available");

export const getRendezVousById = (id) =>
    api.get(`/medecin/rendezvous/${id}`);

export const getRendezVousPatient = (id) =>
    api.get(`/medecin/rendezvous/${id}/patient`);

export const confirmRendezVous = (id) =>
    api.post(`/medecin/rendezvous/${id}/confirm`);

export const cancelRendezVous = (id) =>
    api.post(`/medecin/rendezvous/${id}/cancel`);

export const getUpcomingRendezVous = () =>
    api.get("/medecin/upcoming-rendezvous");

export const getTodayConsultations = () =>
    api.get("/medecin/today-consultations");
