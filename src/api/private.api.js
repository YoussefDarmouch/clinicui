import api from "./axios";

export const getCurrentUser = () => api.get("/user");
export const updateUserProfile = (data) => api.put("/user/profile", data);
export const changePassword = (data) => api.put("/user/password", data);

export const createTemoignage = (data) => api.post("/temoignages", data);
export const updateTemoignage = (id, data) => api.put(`/temoignages/${id}`, data);
export const deleteTemoignage = (id) => api.delete(`/temoignages/${id}`);
