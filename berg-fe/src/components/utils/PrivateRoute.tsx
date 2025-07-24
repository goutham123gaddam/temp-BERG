import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES_FRONTEND } from '../../constant'

export function PrivateRoute() {
    const { validateToken } = useAuth()
    const token = validateToken()
    
    // If not authenticated, redirect to login
    if (!token) {
        return <Navigate to={ROUTES_FRONTEND.LOGIN} />
    }
    
    // If authenticated, allow access to private routes
    return <Outlet />
}