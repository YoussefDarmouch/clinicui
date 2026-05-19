import React, { useState } from "react";
import { register } from "../../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
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
            title="Create Account"
            subtitle="Register for your clinic account"
            description="Sign up to manage appointments, patients and your clinic workflow."
            buttonText="Create account"
            onSubmit={handleRegister}
            onChange={handleChange}
            fields={[
                { name: "name", label: "Nom complet", type: "text", value: form.name, placeholder: "Entrez votre nom" },
                { name: "email", label: "Email", type: "email", value: form.email, placeholder: "Entrez votre email" },
                { name: "password", label: "Mot de passe", type: "password", value: form.password, placeholder: "Choisissez un mot de passe" },
                { name: "password_confirmation", label: "Confirmer le mot de passe", type: "password", value: form.password_confirmation, placeholder: "Confirmez votre mot de passe" },
                { name: "phone", label: "Téléphone", type: "text", value: form.phone, placeholder: "Entrez votre numéro" },
                { name: "address", label: "Adresse", type: "text", value: form.address, placeholder: "Entrez votre adresse" },
                { name: "date_naissance", label: "Date de naissance", type: "date", value: form.date_naissance },
                {
                    name: "sexe",
                    label: "Sexe",
                    type: "select",
                    value: form.sexe,
                    options: [
                        { value: "", label: "Select gender" },
                        { value: "M", label: "Male" },
                        { value: "F", label: "Female" },
                    ],
                },
            ]}
            footer={
                <div className="text-center text-sm text-slate-600">
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                        Login
                    </Link>
                </div>
            }
        />
    );
}

