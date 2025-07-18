// src/components/atoms/CheckboxItem.tsx
import { Checkbox, ListItemText, MenuItem } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

interface CheckboxItemProps {
  label: string;
  selected: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxItem = ({ label, selected, onChange }: CheckboxItemProps) => (
  <MenuItem 
    value={label}
    onClick={() => onChange?.(!selected)}
  >
    <ListItemText primary={label} />
    <Checkbox 
      checked={selected}
      icon={<RadioButtonUncheckedIcon />}
      checkedIcon={<RadioButtonCheckedIcon />}
      onChange={(e) => onChange?.(e.target.checked)}
    />
  </MenuItem>
);

export default CheckboxItem;
