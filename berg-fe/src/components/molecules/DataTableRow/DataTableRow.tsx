
import BaseTableCell from '../../atoms/BaseTableCell/BaseTableCell'
import BaseTableRow from '../../atoms/BaseTableRow/BaseTableRow';

type Column = { title: string | (() => React.ReactNode); field: string; render?: (rowData: string, row: any) => React.ReactNode };

type Props = {
    row: Record<string, any>;
    columns: Column[];
};

const DataTableRow = ({ row, columns }: Props) => {
  
    return (
        <BaseTableRow   >
            {columns.map((column, index) => {
                return (
                    <BaseTableCell key={index} align="left" >
                        {column.render ? column.render(row[column.field], row) : row[column.field]}

                    </BaseTableCell>
                )
            })}
        </BaseTableRow>
    );
};

export default DataTableRow;
