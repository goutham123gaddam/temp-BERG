
import { Box, FormControlLabel, Checkbox } from '@mui/material';

type Props = {
  groupName: string;
  options: string[];
  selectedValues: string[];
  onChange: (groupName: string, value: string) => void;
};

const CheckboxGroupFilter = ({ groupName, options, selectedValues, onChange }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      ml: 1,
      backgroundColor: 'white',
      py: 1,
    }}
  >
    {options.map((option) => (
      <FormControlLabel
        key={option}
        sx={{
          backgroundColor: 'white',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          m: 0,
        }}
        control={
          <Checkbox
            checked={selectedValues.includes(option)}
            onChange={() => onChange(groupName, option)}
            sx={{ p: 0.5 }}
          />
        }
        label={option}
      />
    ))}
  </Box>
);

export default CheckboxGroupFilter;
