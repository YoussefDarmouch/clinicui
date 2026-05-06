import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await login({ email, password });

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

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                {message}
            </Modal>
        </>
    )
}