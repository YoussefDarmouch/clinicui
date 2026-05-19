import React, { useState } from 'react'
import { createUserService } from '../services/admin.service'

export default function UserForm({ onClose, onSuccess }) {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: []
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (e) => {
        const value = Number(e.target.value);

        setForm((prev) => {
            if (prev.roles.includes(value)) {
                return {
                    ...prev,
                    roles: prev.roles.filter(r => r !== value)
                };
            } else {
                return {
                    ...prev,
                    roles: [...prev.roles, value]
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);

        try {
            await createUserService(form);

            alert("User created successfully");

            onSuccess();

        } catch (error) {
            console.log(error.response?.data || error);
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)"
        }}>

            <div style={{
                background: "white",
                width: "400px",
                margin: "80px auto",
                padding: "20px",
                borderRadius: "10px"
            }}>

                <h3>Create User</h3>

                <form onSubmit={handleSubmit}>

                    <input
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <input
                        name="password_confirmation"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                    />

                    <hr />

                    {/* ROLES EXAMPLE */}
                    <label>
                        <input
                            type="checkbox"
                            value={1}
                            onChange={handleRoleChange}
                        />
                        Admin
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value={2}
                            onChange={handleRoleChange}
                        />
                        Medecin
                    </label>

                    <br /><br />

                    <button type="submit">
                        Save
                    </button>

                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>

                </form>

            </div>

        </div>
    );
}