import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const normalizeRole = (role) =>
    String(role || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

export default function PatientRoute({ children }) {
    const auth = useSelector((state) => state.auth);

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (normalizeRole(auth.role) !== "patient") {
        return <Navigate to="/" />;
    }

    return children;
}
