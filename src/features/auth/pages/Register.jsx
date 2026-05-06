import React from 'react'
import { useState } from "react";
import { register } from "../../../api/auth.api";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
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
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await register(form);
            console.log("user creat successful", res);
            alert("Account created ✅");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.log(error);
            alert("Register failed ❌");
        }
    }

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">

            <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
            />

            <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
            />

            <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
            />

            <Input
                label="Confirme Password"
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
            />

            <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
            />

            <Input
                label="Address"
                name="address"

                value={form.address}
                onChange={handleChange}
            />

            <Input
                label="Date de naissance"
                name="date_naissance"
                type="date"
                value={form.date_naissance}
                onChange={handleChange}
            />

            <select name="sexe" onChange={handleChange}>
                <option value="">sexe</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
            </select>


            <Button type="submit">Register</Button>

        </form>
    )
}
