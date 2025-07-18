
import { RadioGroup } from '@mui/material';
import BaseAccordion from '../../atoms/BaseAccordion/BaseAccordion';
import OptionRadio from '../../atoms/OptionRadio/OptionRadio';

type Props = {
  groupLabel: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
};

const GroupAccordionRadio = ({
  groupLabel,
  options,
  selectedValue,
  onChange
}: Props) => {
  return (
    <BaseAccordion title={groupLabel}>
      <RadioGroup
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <OptionRadio key={opt} value={opt} label={opt} />
        ))}
      </RadioGroup>
    </BaseAccordion>
  );
};

export default GroupAccordionRadio;
