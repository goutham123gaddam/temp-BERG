import { TableCell } from '@mui/material';
import React from 'react';

type Props = {
  align?: 'left' | 'right' | 'center';
  children: React.ReactNode;
  isHeader?: boolean;
};

const BaseTableCell = ({ align = 'left', children, isHeader = true }: Props) => {
  return <TableCell align={align} sx={isHeader ? { px: '16px !important' } : undefined}>{children}</TableCell>;
};

export default BaseTableCell;

