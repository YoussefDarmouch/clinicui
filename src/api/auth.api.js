import api from "./axios";

export const login = async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");
export const resetPassword = (data) => api.post("/auth/reset-password", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
