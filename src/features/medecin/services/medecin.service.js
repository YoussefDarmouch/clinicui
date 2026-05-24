import {
    getConsultations,
    getConsultation,
    createConsultation,
    updateConsultation,
    deleteConsultation,
    getOrdonnanceMedicaments,
    getRendezVous,
    getAvailableRendezVous,
    getRendezVousById,
    getRendezVousPatient,
    confirmRendezVous,
    cancelRendezVous,
    getUpcomingRendezVous,
    getTodayConsultations,
    getOrdonnance,
    getOrdonnances
} from "../../../api/medecin.api";
import api from "../../../api/axios";


// CONSULTATIONS

export const getConsultationsService = async () => {
    const res = await getConsultations();
    return res.data;
};

export const getConsultationService = async (id) => {
    const res = await getConsultation(id);
    return res.data;
};

export const createConsultationService = async (data) => {
    const res = await createConsultation(data);
    return res.data;
};

export const updateConsultationService = async (id, data) => {
    const res = await updateConsultation(id, data);
    return res.data;
};

export const deleteConsultationService = async (id) => {
    const res = await deleteConsultation(id);
    return res.data;
};


// ORDONNANCES

const normalizeMedicaments = (medicaments) => {
    if (!Array.isArray(medicaments)) return [];

    return medicaments
        .map((item) => ({
            id: Number(item?.id),
            dose: item?.dose ?? "",
            frequency: item?.frequency ?? "",
            duration_days: Number(item?.duration_days),
        }))
        .filter(
            (item) =>
                Number.isFinite(item.id) &&
                item.id > 0 &&
                String(item.dose).trim() !== "" &&
                String(item.frequency).trim() !== "" &&
                Number.isFinite(item.duration_days) &&
                item.duration_days > 0
        );
};

export const createOrdonnanceService = async (consultationId, data) => {
    const consultationIdValue = Number(consultationId);
    if (!Number.isFinite(consultationIdValue) || consultationIdValue <= 0) {
        throw new Error("consultationId invalide.");
    }

    const payload = {
        valid_until: data?.valid_until ?? null,
        instructions: data?.instructions ?? "",
        medicaments: normalizeMedicaments(data?.medicaments),
    };

    if (!payload.valid_until) {
        throw new Error("valid_until est requis.");
    }
    if (!String(payload.instructions).trim()) {
        throw new Error("instructions est requis.");
    }
    if (!Array.isArray(payload.medicaments) || payload.medicaments.length === 0) {
        throw new Error("medicaments est requis (au moins un medicament).");
    }

    try {
        const response = await api.post(
            `/medecin/consultations/${consultationIdValue}/ordonnances`,
            payload
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrdonnanceMedicamentsService = async (ordonnanceId) => {
    const res = await getOrdonnanceMedicaments(ordonnanceId);
    return res.data;
};

export const getOrdonnancesService = async () => {
    const res = await getOrdonnances();
    return res.data;
};
export const getOrdonnanceService = async (ordonnanceId) => {
    const res = await getOrdonnance(ordonnanceId);
    return res.data;
};

// RENDEZ-VOUS

export const getRendezVousService = async () => {
    const res = await getRendezVous();
    return res.data;
};

export const getAvailableRendezVousService = async () => {
    try {
        const res = await getAvailableRendezVous();
        return res.data;
    } catch (error) {
        const fallback = await getRendezVous();
        return fallback.data;
    }
};

export const getRendezVousByIdService = async (id) => {
    const res = await getRendezVousById(id);
    return res.data;
};

export const getRendezVousPatientService = async (id) => {
    const res = await getRendezVousPatient(id);
    return res.data;
};

export const confirmRendezVousService = async (id) => {
    const res = await confirmRendezVous(id);
    return res.data;
};

export const cancelRendezVousService = async (id) => {
    const res = await cancelRendezVous(id);
    return res.data;
};

export const getUpcomingRendezVousService = async () => {
    const res = await getUpcomingRendezVous();
    return res.data;
};

export const getTodayConsultationsService = async () => {
    const res = await getTodayConsultations();
    return res.data;
};
