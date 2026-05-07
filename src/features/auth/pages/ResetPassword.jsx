import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../../api/auth.api'
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

    if (!email || !token) {
        return <p>Invalid reset link</p>;
    }

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
            await resetPassword({
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

    return (
        <AuthForm
            title="Reset Password"
            buttonText={loading ? "Resetting..." : "Reset Password"}
            loading={loading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            fields={[
                {
                    name: "password",
                    label: "New Password",
                    type: "password",
                    value: form.password,
                    placeholder: "Enter new password"
                },
                {
                    name: "password_confirmation",
                    label: "Confirm Password",
                    type: "password",
                    value: form.password_confirmation,
                    placeholder: "Confirm password"
                }
            ]}
        />
    );
}