import React from 'react';
import Paper from '@mui/material/Paper';

type Props = {
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
};

const BasePaper = ({ children, height = 400, width = '100%' }: Props) => {
  return (
    <Paper sx={{ height, width }}>
      {children}
    </Paper>
  );
};

export default BasePaper;
