import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { loginSuccess } from '../../../app/slices/authSlice'

import { loginService } from '../services/auth.service';
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginService({ email, password });

            dispatch(
                loginSuccess({
                    user: data.user,
                    token: data.token,
                    role: data?.user?.roles?.[0]?.name || "user",
                })
            );

            setMessage("Login successful ✅");
            setModalOpen(true);

        } catch (error) {
            setMessage("Login failed ❌");
            setModalOpen(true);
        }
    };

    return (
        <>
            <form onSubmit={handleLogin}>
                <Input
                    label="Email :"
                    type="email"
                    value={email}
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password :"
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit">Login</Button>
            </form>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {message}
            </Modal>
            <div style={{ marginTop: "10px" }}>
                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>

                <p>
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>
            </div>
        </>
    )
}