export const ROUTES_BACKEND = {
    LOGIN: '/auth/v1/token?grant_type=password',
    SIGNUP: '/auth/v1/signup',
    HOME: '/',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    LOGOUT: '/logout',
    GET_PROJECTS: '/api/v1/projects',
    POST_PROJECTS: '/api/v1/projects',
    GET_BATCHS_ID: '/api/v1/batches?projectId=',
}

export const ROUTES_FRONTEND = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    HOME: '/',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    LOGOUT: '/logout',
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    BATCH: '/projects/:projectId/batches',
}