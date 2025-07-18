import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { useSnackbar } from '../../../hooks/useSnackbar';

const SnackbarComponent: React.FC = () => {
  const { open, message, type, duration, hide } = useSnackbar();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hide();
  };

  const getAlertColor = (type: string): AlertColor => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={getAlertColor(type)}
        variant="filled"
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            fontSize: '0.875rem',
            fontWeight: 500,
          },
        }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default SnackbarComponent; 