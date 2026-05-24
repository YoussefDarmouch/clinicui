import api from "./axios";


// ========================
// 📊 DASHBOARD
// ========================
export const getMedecinDashboardStats = () =>
    api.get("/medecin/dashboard/stats");

export const getUpcomingRendezvous = () =>
    api.get("/medecin/upcoming-rendezvous");

export const getTodayConsultations = () =>
    api.get("/medecin/today-consultations");


// ========================
// 🩺 CONSULTATIONS
// ========================
export const getConsultations = (params = {}) =>
    api.get("/medecin/consultations", { params });

export const getConsultationById = (id) =>
    api.get(`/medecin/consultations/${id}`);

export const getConsultationStats = () =>
    api.get("/medecin/consultations/stats");

export const getConsultationDossier = (id) =>
    api.get(`/medecin/consultations/${id}/dossier`);

export const createConsultation = (data) =>
    api.post("/medecin/consultations", data);

export const updateConsultation = (id, data) =>
    api.put(`/medecin/consultations/${id}`, data);

export const deleteConsultation = (id) =>
    api.delete(`/medecin/consultations/${id}`);

export const createOrdonnanceFromConsultation = (consultationId, data) =>
    api.post(
        `/medecin/consultations/${consultationId}/ordonnances`,
        data
    );


// ========================
// 📅 RENDEZ-VOUS
// ========================
export const getRendezvous = (params = {}) =>
    api.get("/medecin/rendezvous", { params });

export const getRendezvousById = (id) =>
    api.get(`/medecin/rendezvous/${id}`);

export const createRendezvous = (data) =>
    api.post("/medecin/rendezvous", data);

export const updateRendezvous = (id, data) =>
    api.put(`/medecin/rendezvous/${id}`, data);

export const deleteRendezvous = (id) =>
    api.delete(`/medecin/rendezvous/${id}`);

export const confirmRendezvous = (id) =>
    api.post(`/ medecin / rendezvous / ${id} / confirm`);

export const cancelRendezvous = (id) =>
    api.post(`/ medecin / rendezvous / ${id} / cancel`);

export const completeRendezvous = (id) =>
    api.post(`/ medecin / rendezvous / ${id} / complete`);

export const getRendezvousPatient = (id) =>
    api.get(`/ medecin / rendezvous / ${id} / patient`);


// ========================
// 👤 PATIENTS
// ========================
export const getPatients = (params = {}) =>
    api.get("/medecin/patients", { params });

export const getPatientById = (id) =>
    api.get(`/ medecin / patients / ${id}`);

export const getPatientDossier = (id) =>
    api.get(`/ medecin / patients / ${id} / dossier - medical`);

export const getPatientConsultations = (id) =>
    api.get(`/ medecin / patients / ${id} / consultations`);

export const getPatientRendezvous = (id) =>
    api.get(`/ medecin / patients / ${id} / rendezvous`);

export const getPatientOrdonnances = (id) =>
    api.get(`/ medecin / patients / ${id} / ordonnances`);


// ========================
// 💊 ORDONNANCES
// ========================
export const getOrdonnances = (params = {}) =>
    api.get("/medecin/ordonnances", { params });

export const getOrdonnanceById = (id) =>
    api.get(`/ medecin / ordonnances / ${id}`);

export const getOrdonnanceMedicaments = (id) =>
    api.get(`/ medecin / ordonnances / ${id} / medicaments`);

export const deleteOrdonnance = (id) =>
    api.delete(`/ medecin / ordonnances / ${id}`);


// ========================
// 🧩 OPTIONAL WRAPPER
// ========================
export const medecinApi = {
    getMedecinDashboardStats,
    getUpcomingRendezvous,
    getTodayConsultations,

    getConsultations,
    getConsultationById,
    getConsultationStats,
    getConsultationDossier,
    createConsultation,
    updateConsultation,
    deleteConsultation,
    createOrdonnanceFromConsultation,

    getRendezvous,
    getRendezvousById,
    createRendezvous,
    updateRendezvous,
    deleteRendezvous,
    confirmRendezvous,
    cancelRendezvous,
    completeRendezvous,
    getRendezvousPatient,

    getPatients,
    getPatientById,
    getPatientDossier,
    getPatientConsultations,
    getPatientRendezvous,
    getPatientOrdonnances,

    getOrdonnances,
    getOrdonnanceById,
    getOrdonnanceMedicaments,
    deleteOrdonnance,
};