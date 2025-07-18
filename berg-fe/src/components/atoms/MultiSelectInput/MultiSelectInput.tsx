// src/components/atoms/MultiSelectInput.tsx
import {
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import type { ReactNode } from 'react';

import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 600;
const ITEM_PADDING_TOP = 40;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 0.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultiSelectInputProps {
  label: string;
  value: string[];
  onChange: (event: SelectChangeEvent<string[]>) => void;
  children: ReactNode;
  props?:any
}

const MultiSelectInput = ({
  label,
  value,
  onChange,
  children,
  props
}: MultiSelectInputProps) => {
  const labelId = `multi-select-${label}-label`;
  return (
    <FormControl sx={{ m: 1, width: 300 }}>

      <Select
        labelId={labelId}
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        MenuProps={MenuProps}
        {...props}
      >
        {children}
      </Select>
      <InputLabel id={labelId}>{label}</InputLabel>
    </FormControl>
  );
};

export default MultiSelectInput;
