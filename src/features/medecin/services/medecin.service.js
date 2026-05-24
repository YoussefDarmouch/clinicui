import {
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
} from "./medecin.api";


// ========================
// 📊 DASHBOARD SERVICE
// ========================
export const MedecinDashboardService = {
    async getStats() {
        const res = await getMedecinDashboardStats();
        return res.data;
    },

    async getUpcoming() {
        const res = await getUpcomingRendezvous();
        return res.data;
    },

    async getTodayConsultations() {
        const res = await getTodayConsultations();
        return res.data;
    },
};


// ========================
// 📅 RENDEZ-VOUS SERVICE
// ========================
export const RendezVousService = {
    async getAll(params) {
        const res = await getRendezvous(params);
        return res.data;
    },

    async getById(id) {
        const res = await getRendezvousById(id);
        return res.data;
    },

    async create(data) {
        const res = await createRendezvous(data);
        return res.data;
    },

    async update(id, data) {
        const res = await updateRendezvous(id, data);
        return res.data;
    },

    async delete(id) {
        const res = await deleteRendezvous(id);
        return res.data;
    },

    async confirm(id) {
        const res = await confirmRendezvous(id);
        return res.data;
    },

    async cancel(id) {
        const res = await cancelRendezvous(id);
        return res.data;
    },

    async complete(id) {
        const res = await completeRendezvous(id);
        return res.data;
    },

    async getPatient(id) {
        const res = await getRendezvousPatient(id);
        return res.data;
    },
};


// ========================
// 🩺 CONSULTATION SERVICE
// ========================
export const ConsultationService = {
    async getAll(params) {
        const res = await getConsultations(params);
        return res.data;
    },

    async getById(id) {
        const res = await getConsultationById(id);
        return res.data;
    },

    async stats() {
        const res = await getConsultationStats();
        return res.data;
    },

    async dossier(id) {
        const res = await getConsultationDossier(id);
        return res.data;
    },

    async create(data) {
        const res = await createConsultation(data);
        return res.data;
    },

    async update(id, data) {
        const res = await updateConsultation(id, data);
        return res.data;
    },

    async delete(id) {
        const res = await deleteConsultation(id);
        return res.data;
    },

    async createOrdonnance(consultationId, data) {
        const res = await createOrdonnanceFromConsultation(consultationId, data);
        return res.data;
    },
};


// ========================
// 👤 PATIENT SERVICE
// ========================
export const PatientService = {
    async getAll(params) {
        const res = await getPatients(params);
        return res.data;
    },

    async getById(id) {
        const res = await getPatientById(id);
        return res.data;
    },

    async dossier(id) {
        const res = await getPatientDossier(id);
        return res.data;
    },

    async consultations(id) {
        const res = await getPatientConsultations(id);
        return res.data;
    },

    async rendezvous(id) {
        const res = await getPatientRendezvous(id);
        return res.data;
    },

    async ordonnances(id) {
        const res = await getPatientOrdonnances(id);
        return res.data;
    },
};


// ========================
// 💊 ORDONNANCE SERVICE
// ========================
export const OrdonnanceService = {
    async getAll(params) {
        const res = await getOrdonnances(params);
        return res.data;
    },

    async getById(id) {
        const res = await getOrdonnanceById(id);
        return res.data;
    },

    async medicaments(id) {
        const res = await getOrdonnanceMedicaments(id);
        return res.data;
    },

    async delete(id) {
        const res = await deleteOrdonnance(id);
        return res.data;
    },
};