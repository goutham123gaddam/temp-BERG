import { TableRow } from '@mui/material';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const BaseTableRow = ({ children }: Props) => {
  return <TableRow sx={{p:1}}>{children}</TableRow>;
};

export default BaseTableRow;
