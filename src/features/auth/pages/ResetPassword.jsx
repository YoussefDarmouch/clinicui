import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { resetPasswordService } from '../services/auth.service'
import AuthForm from '../components/AuthForm'

export default function ResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const [form, setForm] = useState({
        password: "",
        password_confirmation: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!email || !token) {
            setError("Invalid reset link");
        }
    }, [email, token]);

    const handleChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await resetPasswordService({
                email,
                token,
                password: form.password,
                password_confirmation: form.password_confirmation,
            });

            alert("Password reset successfully");

            navigate("/login");

        } catch (err) {
            alert("Invalid or expired token");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950/95 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur-xl text-center">
                    <p className="text-lg font-semibold text-slate-900">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <AuthForm
            title="Reset Password"
            subtitle="Set a new password"
            description="Choose a strong password to keep your account safe."
            buttonText={loading ? "Resetting..." : "Reset password"}
            loading={loading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            fields={[
                {
                    name: "password",
                    label: "New Password",
                    type: "password",
                    value: form.password,
                    placeholder: "Enter your new password"
                },
                {
                    name: "password_confirmation",
                    label: "Confirm Password",
                    type: "password",
                    value: form.password_confirmation,
                    placeholder: "Confirm your password"
                }
            ]}
            footer={
                <div className="text-center text-sm text-slate-600">
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                        Back to login
                    </Link>
                </div>
            }
        />
    );
}

