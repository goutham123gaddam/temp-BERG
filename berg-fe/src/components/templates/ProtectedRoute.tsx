import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES_FRONTEND } from '../../constant'

export default function ProtectedRoute() {
    const {  validateToken} = useAuth()
    const token = validateToken()
    if (!token) {
        return <Outlet />
    }
    return <Navigate to={ROUTES_FRONTEND.HOME} />
}