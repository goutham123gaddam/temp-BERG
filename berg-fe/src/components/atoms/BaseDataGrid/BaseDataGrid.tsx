
import { DataGrid } from '@mui/x-data-grid';
import type { DataGridProps } from '@mui/x-data-grid';

const BaseDataGrid = (props: DataGridProps) => {
  return <DataGrid {...props} sx={{ border: 0, ...props.sx }} />;
};

export default BaseDataGrid;
