// src/components/molecules/CountBoxGroup/CountBoxGroup.tsx

import React from 'react';
import { Box } from '@mui/material';
import CountBox from '../../molecules/CountBox/CountBox'

interface CountBoxData {
  label: string;
  count: number | string;
  icon: React.ReactNode;
  color?: string;
}

interface CountBoxGroupProps {
  items: CountBoxData[];
}

const CountBoxGroup: React.FC<CountBoxGroupProps> = ({ items }) => {
  return (
    <Box display="flex" gap={2}  flex-wrap= "nowrap" py={2}>
      {items.map((item, index) => (
        <CountBox
          key={index}
          label={item.label}
          count={item.count}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </Box>
  );
};

export default CountBoxGroup;
