import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordService } from "../services/auth.service";
import AuthForm from "../components/AuthForm";

export default function ForgotPassword() {
    const [form, setForm] = useState({ email: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await forgotPasswordService({ email: form.email });

            setMessage(res.data.message);

        } catch (err) {
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm
            title="Forgot Password"
            subtitle="Reset your password"
            description="Enter your email address and we will send a password reset link."
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
            footer={
                <div className="space-y-4 text-sm text-slate-600">
                    {message && <p className="text-sm text-slate-600">{message}</p>}
                    <p className="text-center">
                        Remembered your password?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                            Login
                        </Link>
                    </p>
                </div>
            }
        />
    );
}

