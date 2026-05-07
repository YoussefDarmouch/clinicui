import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../../api/auth.api'
import AuthForm from '../components/AuthForm'

export default function ForgotPassword() {

    const [form, setForm] = useState({
        email: ""
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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
            const res = await forgotPassword({ email: form.email });

            console.log("SUCCESS:", res);

            const token = res?.data?.data?.token;
            const userEmail = form.email;

            navigate(`/reset-password?token=${token}&email=${userEmail}`);

        } catch (err) {
            console.log("ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Forgot Password"
            buttonText="Send reset link"
            loading={loading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            fields={[
                {
                    name: "email",
                    label: "Email",
                    type: "email",
                    value: form.email,
                    placeholder: "Enter your email"
                }
            ]}
        />
    );
}