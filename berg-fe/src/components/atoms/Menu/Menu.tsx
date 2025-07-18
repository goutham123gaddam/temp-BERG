import React from 'react';
import { Menu, Box} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  width?: number | string;
  maxHeight?: number | string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

const BaseMenu = ({
  anchorEl,
  open,
  onClose,
  width = 280,
  maxHeight = 400,
  children,
  sx = {}
}: Props) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            width,
            maxHeight,
            overflowY: 'auto',
            p: 1,
            ...sx,
          },
        },
      }}
    >
      <Box>{children}</Box>
    </Menu>
  );
};

export default BaseMenu;
