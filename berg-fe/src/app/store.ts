import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import snackbarReducer from '../features/snackbar/snackbarSlice'
import projectReducer from '../features/project/projectSlice';
import batchReducer from '../features/batch/batchSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
     projects: projectReducer,
      batch: batchReducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;