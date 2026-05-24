import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginSuccess } from '../../../app/slices/authSlice'
import { login } from '../../../api/auth.api'
import Modal from '../../../components/ui/Modal'

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from || "/";

    const normalizeRole = (role) =>
        String(role || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email: form.email, password: form.password });
            const user = res.data.user || res.data.data?.user;
            const token = res.data.token || res.data.data?.token;

            if (!token || !user) throw new Error("Invalid login response");

            dispatch(loginSuccess({
                user,
                token,
                role: user?.roles?.[0]?.name || "user",
            }));

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", user?.roles?.[0]?.name || "user");

            const role = user?.roles?.[0]?.name || "user";
            const normalizedRole = normalizeRole(role);

            if (normalizedRole === "admin") {
                navigate("/admin/dashboard");
                return;
            }

            if (normalizedRole === "medecin") {
                navigate("/medecin/dashboard");
                return;
            }

            navigate(redirectPath);
        } catch (error) {
            console.log(error);
            setMessage(error?.response?.data?.message || "Login failed ❌");
            setModalOpen(true);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
                <div className="flex w-full max-w-3xl min-h-[560px] rounded-2xl overflow-hidden shadow-2xl">

                    {/* Left Panel */}
                    <div className="hidden md:flex w-[42%] flex-col justify-between p-10 relative overflow-hidden bg-primary-700">
                        {/* Decorative circles */}
                        <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

                        {/* Brand */}
                        <div className="flex items-center gap-3 z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L12 22M2 12H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M6 6C6 6 8 10 12 10C16 10 18 6 18 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm tracking-wide leading-none">DESOGHN</p>
                                <p className="text-white/60 text-[10px] font-medium tracking-[0.15em] mt-0.5">CLINIC</p>
                            </div>
                        </div>

                        {/* Headline */}
                        <div className="z-10">
                            <h2 className="text-white text-[22px] font-bold leading-snug mb-3">
                                Your Health,<br />Our Priority
                            </h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                We're here to provide the best care for you and your family.
                            </p>
                        </div>

                        {/* Trust badge */}
                        <div className="z-10 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-4">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
                                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white/90 text-[12.5px] font-semibold mb-0.5">Trusted by patients</p>
                                <p className="text-white/55 text-[11.5px]">Compassionate care since 2010</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 flex flex-col justify-center px-8 py-10 bg-white">

                        {/* Logo circle */}
                        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-5">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary-600">
                                <path d="M12 2L12 22M2 12H22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M6 6C6 6 8 10 12 10C16 10 18 6 18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-[22px] font-bold text-gray-900">Welcome Back</h1>
                            <p className="text-sm text-gray-500 mt-1">Login to your account to continue</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email or Phone
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email or phone number"
                                        required
                                        className="w-full h-11 pl-9 pr-4 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full h-11 pl-9 pr-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded accent-primary-600 cursor-pointer"
                                    />
                                    Remember me
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full h-11 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Login
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">or</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="w-full h-11 border border-primary-100 rounded-lg text-sm font-medium text-primary-700 flex items-center justify-center gap-2.5 hover:bg-primary-50 active:scale-[0.99] transition-all mb-5"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-primary-600">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Login with Google
                        </button>

                        {/* Sign up */}
                        <p className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {message}
            </Modal>
        </>
    );
}

