import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute({ children }) {
    const auth = useSelector((state) => state.auth)

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />
    }

    if (auth.role !== 'admin') {
        return <Navigate to="/" />
    }

    return children
}