
import { Chip } from '@mui/material';

type Props = {
  label: string;
  color?: string;
  textColor?: string;
};

const StatusChip = ({ label, color = '#744DCD', textColor = '#fff' }: Props) => {
  return (
    <Chip
      label={label}
      sx={{
        padding: '4px 8px',
        bgcolor: color,
        color: textColor,
        fontWeight: 500,
      }}
    />
  );
};

export default StatusChip;
