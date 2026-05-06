import api from "./axios";

// RENDEZ-VOUS


export const getRendezVous = () =>
    api.get("/patient/rendezvous");

export const getRendezVousById = (id) =>
    api.get(`/patient/rendezvous/${id}`);

export const createRendezVous = (data) =>
    api.post("/patient/rendezvous", data);

export const updateRendezVous = (id, data) =>
    api.put(`/patient/rendezvous/${id}`, data);

export const cancelRendezVous = (id) =>
    api.put(`/patient/rendezvous/${id}/cancel`);

export const getAvailableSlots = () =>
    api.get("/patient/rendezvous/available-slots");


// DOSSIER MEDICAL

export const getDossierMedical = () =>
    api.get("/patient/dossier-medical");

export const getDossierById = (id) =>
    api.get(`/ patient/dossier-medical/${id}`);

export const updateDossierMedical = (data) =>
    api.put("/patient/dossier-medical", data);



// CONSULTATIONS (READ ONLY)


export const getConsultations = () =>
    api.get("/patient/consultations");

export const getConsultation = (id) =>
    api.get(`/ patient / consultations / ${id}`);

// ORDONNANCES (READ ONLY)



export const getOrdonnances = () =>
    api.get("/patient/ordonnances");

export const getOrdonnance = (id) =>
    api.get(`/ patient / ordonnances / ${id}`);

// PROFILE


export const getProfile = () =>
    api.get("/patient/profile");

export const updateProfile = (data) =>
    api.put("/patient/profile", data);

export const uploadAvatar = (formData) =>
    api.post("/patient/profile/avatar", formData);


// STATISTICS / DASHBOARD


export const getStatistics = () =>
    api.get("/patient/statistics");