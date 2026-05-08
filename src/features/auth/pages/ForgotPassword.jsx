import { useState } from "react";
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
        <div>
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

            {message && <p>{message}</p>}
        </div>
    );
}