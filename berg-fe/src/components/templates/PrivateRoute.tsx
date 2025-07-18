import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function PrivateRoute() {
    const {  validateToken} = useAuth()
    const token = validateToken()
    if (!token) {
        return <Navigate to="/login" />
    }
    return <Outlet />
}