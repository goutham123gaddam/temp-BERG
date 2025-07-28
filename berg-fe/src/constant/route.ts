export const ROUTES_BACKEND = {
    LOGIN: '/auth/v1/token?grant_type=password',
    SIGNUP: '/auth/v1/signup',
    HOME: '/',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    LOGOUT: '/logout',
    GET_PROJECTS: '/api/v1/projects',
    POST_PROJECTS: '/api/v1/projects',
    DELETE_PROJECTS: '/api/v1/projects',
    GET_BATCHS_ID: '/api/v1/batches?projectId=',
    GET_BATCH_STATISTICS: '/api/v1/batches/statistics',
    ADD_BATCH: '/api/v1/batches',
    DELETE_BATCH:'/api/v1/batches',
    GET_TASKS: '/api/v1/tasks',
    POST_TASKS: '/api/v1/tasks',
    PUT_TASKS: '/api/v1/tasks',
    DELETE_TASKS: '/api/v1/tasks',
    GET_MY_TASKS: '/api/v1/tasks/my-tasks', // New endpoint for annotator tasks
    GET_TASK_STATISTICS: '/api/v1/tasks/statistics', // New endpoint for task stats
    UPDATE_ANNOTATION: '/api/v1/tasks/:id/annotation', // New endpoint for annotations
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
    TASKS: '/tasks', // New standalone tasks route
    BATCH_TASKS: '/projects/:projectId/batches/:batchId/tasks', // Keep existing nested route
    TEAM:'/team'
}