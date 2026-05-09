import { createSlice } from "@reduxjs/toolkit";

// 🔥 safe parse function
const getUserFromStorage = () => {
    try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser || storedUser === "undefined") {
            return null;
        }

        return JSON.parse(storedUser);
    } catch (e) {
        return null;
    }
};

const token = localStorage.getItem("token");

const initialState = {
    user: getUserFromStorage(),
    token: token && token !== "undefined" ? token : null,
    role: localStorage.getItem("role") || null,
    isAuthenticated: !!token && token !== "undefined",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;

            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;