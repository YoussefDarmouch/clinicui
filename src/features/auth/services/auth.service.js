import {
    login,
    register,
    forgotPassword,
    resetPassword,
    logout
} from "../../../api/auth.api";
export const loginService = async (data) => {
    return await login(data);
};

export const registerService = async (data) => {
    return await register(data);
};

export const forgotPasswordService = async (data) => {
    return await forgotPassword(data);
};

export const resetPasswordService = async (data) => {
    return await resetPassword(data);
};

export const logoutService = async () => {
    return await logout();
};