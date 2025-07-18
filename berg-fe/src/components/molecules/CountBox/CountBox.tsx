// src/components/molecules/CountBox/CountBox.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Optional icon
import Divider from '@mui/material/Divider';

interface CountBoxProps {
  label: string;
  count: number | string;
  icon?: React.ReactNode;
  color?: string;
}

const CountBox: React.FC<CountBoxProps> = ({ label, count, icon = <TrendingUpIcon />, color = '#1976d2' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      px={4}
      py={3}
      borderRadius={2}
      boxShadow={2}
      bgcolor="white"
      minWidth={350}
    >
      {/* Top row: icon and label */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="textSecondary">
            {label}
          </Typography>
        </Box>
        <Box color={color} flex={1} display={'flex'} justifyContent={'flex-end'} gap={5}>{icon}</Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Typography variant="h4">{count}</Typography>
    </Box>

  );
};

export default CountBox;
