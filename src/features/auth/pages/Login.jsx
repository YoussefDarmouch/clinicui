import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginSuccess } from '../../../app/slices/authSlice'
import { login } from '../../../api/auth.api'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from || "/";
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await login({ email, password });

            const user = res.data.user || res.data.data?.user;
            const token = res.data.token || res.data.data?.token;

            if (!token || !user) {
                throw new Error("Invalid login response");
            }

            dispatch(
                loginSuccess({
                    user,
                    token,
                    role: user?.roles?.[0]?.name || "user",
                })
            );

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", user?.roles?.[0]?.name || "user");
            navigate(redirectPath);

        } catch (error) {
            console.log(error);
            setMessage(error?.response?.data?.message || "Login failed ❌");
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