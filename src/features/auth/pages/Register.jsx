import React, { useState } from "react";
import { register } from "../../../api/auth.api";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        address: "",
        date_naissance: "",
        sexe: "",
    });

    const handleChange = (name, value) => {
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register(form);

            alert("Account created ✅");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            alert("Register failed ❌");
        }
    };

    return (
        <AuthForm
            title="Register"
            buttonText="Create account"
            onSubmit={handleRegister}
            onChange={handleChange}
            fields={[
                { name: "name", label: "Name", type: "text", value: form.name },
                { name: "email", label: "Email", type: "email", value: form.email },
                { name: "password", label: "Password", type: "password", value: form.password },
                { name: "password_confirmation", label: "Confirm Password", type: "password", value: form.password_confirmation },
                { name: "phone", label: "Phone", type: "text", value: form.phone },
                { name: "address", label: "Address", type: "text", value: form.address },
                { name: "date_naissance", label: "Date de naissance", type: "date", value: form.date_naissance },
            ]}
            footer={
                <select
                    name="sexe"
                    value={form.sexe}
                    onChange={(e) => handleChange("sexe", e.target.value)}
                    style={{ marginTop: "10px" }}
                >
                    <option value="">sexe</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
            }
        />
    );
}