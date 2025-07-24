import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from '@mui/material';
import BaseTableCell from '../../atoms/BaseTableCell/BaseTableCell';
import BaseTableRow from '../../atoms/BaseTableRow/BaseTableRow';
import DataTableRow from '../../molecules/DataTableRow/DataTableRow';

type Column = { title: string | (() => React.ReactNode); field: string; render?: (rowData: string, row: any) => React.ReactNode };
type Row = Record<string, any>;

type Props = {
  columns: Column[];
  rows: Row[];
};

const DataTable = ({ columns, rows }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead
          sx={{
            backgroundColor: '#F5F5F5',
            fontWeight: 500

          }}>
          <BaseTableRow >
            {columns.map((col, index) => (
              <BaseTableCell key={index} isHeader={true}>
                {typeof col.title === 'function' ? col.title() : col.title}
              </BaseTableCell>
            ))}
          </BaseTableRow>
        </TableHead>
        <TableBody>
         
          {rows.map((row, index) => (
            <DataTableRow key={index} row={row} columns={columns} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
