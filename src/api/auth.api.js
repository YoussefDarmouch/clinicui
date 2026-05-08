import api from "./axios";
export const login = async (data) => {
    const res = await api.post("auth/login", data);
    return res.data.data;
};
export const register = (data) => {
    return api.post("auth/register", data);
}
export const logout = () => {
    return api.post("auth/logout");
}
export const resetPassword = (data) => {
    return api.post("auth/reset-password", data);
}
export const forgotPassword = (data) => {
    return api.post("auth/forgot-password", data);
}