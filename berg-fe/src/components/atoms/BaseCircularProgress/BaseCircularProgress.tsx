import React from 'react';
import { CircularProgress, type CircularProgressProps } from '@mui/material';

const BaseCircularProgress: React.FC<CircularProgressProps> = (props,sx={}) => {
  return <CircularProgress {...props} sx={{...sx}   }   />;
};

export default BaseCircularProgress;
