import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES_FRONTEND } from '../../constant';

export function PublicOnlyRoute() {
    const { validateToken } = useAuth()
    const token = validateToken()
    
    // If user is authenticated, redirect to home
    if (token) {
        return <Navigate to={ROUTES_FRONTEND.HOME} />
    }
    
    // If not authenticated, allow access to public routes
    return <Outlet />
}