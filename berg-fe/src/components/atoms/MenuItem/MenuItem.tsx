
import { FormControlLabel, Radio } from '@mui/material';

type Props = {
  value: string;
  label: string;
};

const OptionRadio = ({ value, label }: Props) => {
  return <FormControlLabel value={value} control={<Radio />} label={label} />;
};

export default OptionRadio;
