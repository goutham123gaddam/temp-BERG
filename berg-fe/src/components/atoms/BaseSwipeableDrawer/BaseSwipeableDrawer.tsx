
import React from 'react';
import { SwipeableDrawer, type SwipeableDrawerProps } from '@mui/material';

const BaseSwipeableDrawer: React.FC<SwipeableDrawerProps> = (props) => {
  return <SwipeableDrawer {...props} />;
};

export default BaseSwipeableDrawer;
