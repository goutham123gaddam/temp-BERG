// RadioGroupFilter.tsx
import React from 'react';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

type Props = {
  groupName: string;
  options: string[];
  selectedValue: string;
  onChange: (groupName: string, value: string) => void;
};

const RadioGroupFilter = ({ groupName, options, selectedValue, onChange }: Props) => (
  <RadioGroup
    value={selectedValue}
    onChange={(e) => onChange(groupName, e.target.value)}
  >
    {options.map((option) => (
      <FormControlLabel
        key={option}
        value={option}
        control={<Radio />}
        label={option}
      />
    ))}
  </RadioGroup>
);

export default RadioGroupFilter;
