import api from "./axios";
// user apis
// crud user 
export const getUsers = () => {
    api.get("/admin/users")
}
export const getUser = (id) => {
    api.get(`/admin/users/${id}`)
}
export const createUser = (data) => {
    api.post("/admin/users", data)
}
export const updateUser = (id, data) => {
    api.put(`/admin/users/${id}`, data)
}
export const deleteUser = (id) => {
    api.delete(`/admin/users/${id}`)
}
// user roles 
export const assignRole = (id, role) => {
    api.post(`/admin/users/${id}/assign-role`, { role });
}
export const revokeRole = (id, role) => {
    api.post(`/admin/users/${id}/revoke-role`, { role });
}
// active user or deactivate
export const activate = (id) => {
    api.post(`/admin/users/${id}/activate`);
}
export const deactivate = (id) => {
    api.post(`/admin/users/${id}/deactivate`);
}
// crud medcins
export const getAdminMedecins = () => {
    api.get("/admin/medecins")
}
export const getMedecin = (id) =>
    api.get(`/admin/medecins/${id}`);

export const createMedecin = (data) => {
    api.post("/admin/medecins", data)
}
export const updateMedecin = (id, data) => {
    api.put(`/admin/medecins/${id}`, data)
}
export const deleteMedecin = (id) => {
    api.delete(`/admin/medecins/${id}`)
}
export const getMedecinConsultations = (id) => {
    api.get(`/admin/medecins/${id}/consultations`)
}
export const getMedecinRendezVous = (id) => {
    api.get(`/admin/medecins/${id}/rendezvous`)
}
// crud patient 
export const getAdminPatients = () => {
    api.get("/admin/patients")
}
export const getPatient = (id) =>
    api.get(`/admin/patients/${id}`);

export const createPatient = (data) => {
    api.post("/admin/patients", data)
}
export const updatePatient = (id, data) => {
    api.put(`/admin/patients/${id}`, data)
}
export const deletePatient = (id) => {
    api.delete(`/admin/patients/${id}`)
}
export const getDossierMedical = (id) => {
    api.delete(`/admin/patients/${id}/dossier-medical`)
}
export const getPatientConsultations = (id) => {
    api.get(`/admin/patients/${id}/consultations`)
}
export const getPatientOrdonnances = (id) => {
    api.get(`/admin/patients/${id}/ordonnances`)
}
// crud Specialite
export const getAdminSpecialites = () => {
    api.get("/admin/specialites")
}
export const getSpecialite = (id) =>
    api.get(`/admin/specialites/${id}`);

export const createSpecialite = (data) => {
    api.post("/admin/specialites", data)
}
export const updateSpecialite = (id, data) => {
    api.put(`/admin/specialites/${id}`, data)
}
export const deleteSpecialite = (id) => {
    api.delete(`/admin/specialites/${id}`)
}
export const getDashboardStats = () => {
    api.get("/admin/statistics/dashboard")
}
export const getUserStats = () => {
    api.get("/admin/statistics/users")
}
export const getConsultationStats = () => {
    api.get("/admin/statistics/consultations")
}

