import {
    getMedecin,
    getAvailableSlots,
    searchMedecinsBySpecialite,
    getSpecialites,
    getMedecinsBySpecialite,
    getMedecins,
    getMedicaments
} from "../../../api/public.api";

export const getMedecinService = async (id) => {
    return await getMedecin(id);
};

export const getAvailableSlotsService = async (id, date) => {
    return await getAvailableSlots(id, date);
};

export const searchMedecinsBySpecialiteService = async (specialite) => {
    return await searchMedecinsBySpecialite(specialite);
};

export const getSpecialitesService = async () => {
    return await getSpecialites();
};

export const getMedecinsBySpecialiteService = async (id) => {
    return await getMedecinsBySpecialite(id);
};

export const getMedecinsService = async () => {
    return await getMedecins();
};

export const getMedicamentsService = async () => {
    return await getMedicaments();
};