import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

const SNACKBAR_DURATION = 4000; // 4 seconds

export interface SnackbarState {
  open: boolean;
  message: string;
  type: SnackbarType;
}

const initialState: SnackbarState = {
  open: false,
  message: '',
  type: 'info',
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<Omit<SnackbarState, 'open'>>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
    showSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = 'success';
    },
    showError: (state, action: PayloadAction<{ message: string }>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = 'error';
    },
    showWarning: (state, action: PayloadAction<{ message: string }>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = 'warning';
    },
    showInfo: (state, action: PayloadAction<{ message: string }>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = 'info';
    },
  },
});

export const {
  showSnackbar,
  hideSnackbar,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} = snackbarSlice.actions;

// Export the constant duration
export { SNACKBAR_DURATION };

export default snackbarSlice.reducer; 