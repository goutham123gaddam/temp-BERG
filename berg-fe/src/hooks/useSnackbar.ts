import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import {
  showSnackbar,
  hideSnackbar,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  type SnackbarType,
  SNACKBAR_DURATION,
} from '../features/snackbar/snackbarSlice';

export const useSnackbar = () => {
  const { open, message, type } = useSelector(
    (state: RootState) => state.snackbar
  );

  const dispatch = useDispatch<AppDispatch>();

  const show = (message: string, type: SnackbarType) => {
    dispatch(showSnackbar({ message, type }));
  };

  const hide = () => {
    dispatch(hideSnackbar());
  };

  const success = (message: string) => {
    dispatch(showSuccess({ message }));
  };

  const error = (message: string) => {
    dispatch(showError({ message }));
  };

  const warning = (message: string) => {
    dispatch(showWarning({ message }));
  };

  const info = (message: string) => {
    dispatch(showInfo({ message }));
  };

  return {
    // State
    open,
    message,
    type,
    duration: SNACKBAR_DURATION,
    
    // Actions
    show,
    hide,
    success,
    error,
    warning,
    info,
  };
}; 