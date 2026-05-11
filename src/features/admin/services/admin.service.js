import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    assignRole,
    revokeRole,
    activateUser,
    deactivateUser,

    getAdminMedecins,
    getAdminMedecin,
    createMedecin,
    updateMedecin,
    deleteMedecin,
    getMedecinConsultations,
    getMedecinRendezVous,

    getAdminPatients,
    getAdminPatient,
    createPatient,
    updatePatient,
    deletePatient,
    getDossierMedical,
    getPatientConsultations,
    getPatientOrdonnances,

    getAdminSpecialites,
    getAdminSpecialite,
    createSpecialite,
    updateSpecialite,
    deleteSpecialite,

    getDashboardStats,
    getUserStats,
    getConsultationStats
} from "../../../api/admin.api";


// ================= USERS =================
export const getUsersService = async () => {
    const res = await getUsers();
    return res.data;
};

export const getUserService = async (id) => {
    const res = await getUser(id);
    return res.data;
};

export const createUserService = async (data) => {
    const res = await createUser(data);
    return res.data;
};

export const updateUserService = async (id, data) => {
    const res = await updateUser(id, data);
    return res.data;
};

export const deleteUserService = async (id) => {
    const res = await deleteUser(id);
    return res.data;
};

export const assignRoleService = async (id, role) => {
    const res = await assignRole(id, role);
    return res.data;
};

export const revokeRoleService = async (id, role) => {
    const res = await revokeRole(id, role);
    return res.data;
};

export const activateUserService = async (id) => {
    const res = await activateUser(id);
    return res.data;
};

export const deactivateUserService = async (id) => {
    const res = await deactivateUser(id);
    return res.data;
};


// ================= MEDECINS =================
export const getMedecinsService = async () => {
    const res = await getAdminMedecins();
    return res.data;
};

export const getMedecinService = async (id) => {
    const res = await getAdminMedecin(id);
    return res.data;
};

export const createMedecinService = async (data) => {
    const res = await createMedecin(data);
    return res.data;
};

export const updateMedecinService = async (id, data) => {
    const res = await updateMedecin(id, data);
    return res.data;
};

export const deleteMedecinService = async (id) => {
    const res = await deleteMedecin(id);
    return res.data;
};

export const getMedecinConsultationsService = async (id) => {
    const res = await getMedecinConsultations(id);
    return res.data;
};

export const getMedecinRendezVousService = async (id) => {
    const res = await getMedecinRendezVous(id);
    return res.data;
};


// ================= PATIENTS =================
export const getPatientsService = async () => {
    const res = await getAdminPatients();
    return res.data;
};

export const getPatientService = async (id) => {
    const res = await getAdminPatient(id);
    return res.data;
};

export const createPatientService = async (data) => {
    const res = await createPatient(data);
    return res.data;
};

export const updatePatientService = async (id, data) => {
    const res = await updatePatient(id, data);
    return res.data;
};

export const deletePatientService = async (id) => {
    const res = await deletePatient(id);
    return res.data;
};

export const getDossierMedicalService = async (id) => {
    const res = await getDossierMedical(id);
    return res.data;
};

export const getPatientConsultationsService = async (id) => {
    const res = await getPatientConsultations(id);
    return res.data;
};

export const getPatientOrdonnancesService = async (id) => {
    const res = await getPatientOrdonnances(id);
    return res.data;
};


// ================= SPECIALITES =================
export const getSpecialitesService = async () => {
    const res = await getAdminSpecialites();
    return res.data;
};

export const getSpecialiteService = async (id) => {
    const res = await getAdminSpecialite(id);
    return res.data;
};

export const createSpecialiteService = async (data) => {
    const res = await createSpecialite(data);
    return res.data;
};

export const updateSpecialiteService = async (id, data) => {
    const res = await updateSpecialite(id, data);
    return res.data;
};

export const deleteSpecialiteService = async (id) => {
    const res = await deleteSpecialite(id);
    return res.data;
};


// ================= STATISTICS =================
export const getDashboardStatsService = async () => {
    const res = await getDashboardStats();
    return res.data;
};

export const getUserStatsService = async () => {
    const res = await getUserStats();
    return res.data;
};

export const getConsultationStatsService = async () => {
    const res = await getConsultationStats();
    return res.data;
};