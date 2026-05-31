import {
    getRendezVous,
    getRendezVousById,
    createRendezVous,
    updateRendezVous,
    cancelRendezVous,
    getAvailableSlots,

    getDossierMedical,
    getDossierById,
    updateDossierMedical,

    getConsultations,
    getConsultation,

    getOrdonnances,
    getOrdonnance,

    getProfile,
    updateProfile,
    uploadAvatar,

    getStatistics,
} from "../../../api/patient.api";

// RENDEZ-VOUS
export const getRendezVousService = async () => {
    const res = await getRendezVous();
    return res.data;
};

export const getRendezVousByIdService = async (id) => {
    const res = await getRendezVousById(id);
    return res.data;
};

export const createRendezVousService = async (data) => {
    const res = await createRendezVous(data);
    return res.data;
};

export const updateRendezVousService = async (id, data) => {
    const res = await updateRendezVous(id, data);
    return res.data;
};

export const cancelRendezVousService = async (id) => {
    const res = await cancelRendezVous(id);
    return res.data;
};

export const getAvailableSlotsService = async (params) => {
    const res = await getAvailableSlots(params);
    return res.data;
};

// DOSSIER MEDICAL
export const getDossierMedicalService = async () => {
    const res = await getDossierMedical();
    return res.data;
};

export const getDossierByIdService = async (id) => {
    const res = await getDossierById(id);
    return res.data;
};

export const updateDossierMedicalService = async (data) => {
    const res = await updateDossierMedical(data);
    return res.data;
};

// CONSULTATIONS
export const getConsultationsService = async () => {
    const res = await getConsultations();
    return res.data;
};

export const getConsultationService = async (id) => {
    const res = await getConsultation(id);
    return res.data;
};

// ORDONNANCES
export const getOrdonnancesService = async () => {
    const res = await getOrdonnances();
    return res.data;
};

export const getOrdonnanceService = async (id) => {
    const res = await getOrdonnance(id);
    return res.data;
};

// PROFILE
export const getProfileService = async () => {
    const res = await getProfile();
    return res.data;
};

export const updateProfileService = async (data) => {
    const res = await updateProfile(data);
    return res.data;
};

export const uploadAvatarService = async (formData) => {
    const res = await uploadAvatar(formData);
    return res.data;
};

// STATISTICS
export const getStatisticsService = async () => {
    const res = await getStatistics();
    return res.data;
};