import React, { useState } from 'react';
import { Box } from '@mui/material';
import ButtonComponent from '../../atoms/Button/Button';
import BaseMenu from '../../atoms/Menu/Menu';
import BaseAccordion from '../../atoms/BaseAccordion/BaseAccordion';
import RadioGroupFilter from '../../molecules/RadioGroupFilter/RadioGroupFilter';
import CheckboxGroupFilter from '../../molecules/CheckboxGroupFilter/CheckboxGroupFilter';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

export type GroupedOption = {
  group: string;
  type: 'radio' | 'checkbox';
  options: string[];
};

type Props = {
  groupedOptions: GroupedOption[];
  triggerLabel?: string;
  applyButtonLabel?: string;
  onApplyFilter?: (
    selectedValues: Record<string, string>,
    selectedCheckboxes: Record<string, string[]>
  ) => void;
  icon?: React.ReactNode;
};

const ExternalFilter = ({
  groupedOptions,
  triggerLabel = 'Filter',
  applyButtonLabel = 'Apply Filter',
  onApplyFilter,
  icon,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, string[]>>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleChange = (groupName: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [groupName]: value }));
  };

  const handleCheckboxChange = (groupName: string, value: string) => {
    setSelectedCheckboxes((prev) => {
      const currentValues = prev[groupName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [groupName]: newValues };
    });
  };

  const handleApply = () => {
    if (onApplyFilter) {
      onApplyFilter(selectedValues, selectedCheckboxes);
    }
    handleClose();
  };

  return (
    <Box>
      <ButtonComponent buttonVariant="secondary" onClick={handleClick}>
        <Box display={'flex'} alignItems={'center'}>{icon && icon }
          {triggerLabel}
        </Box>
      </ButtonComponent>

      <BaseMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {groupedOptions.map((group) => (
          <BaseAccordion key={group.group} title={group.group}>
            {group.type === 'radio' && (
              <RadioGroupFilter
                groupName={group.group}
                options={group.options}
                selectedValue={selectedValues[group.group] || ''}
                onChange={handleChange}
              />
            )}

            {group.type === 'checkbox' && (
              <CheckboxGroupFilter
                groupName={group.group}
                options={group.options}
                selectedValues={selectedCheckboxes[group.group] || []}
                onChange={handleCheckboxChange}
              />
            )}
          </BaseAccordion>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <ButtonComponent buttonVariant="primary" onClick={handleApply}>
            {applyButtonLabel}
          </ButtonComponent>
        </Box>
      </BaseMenu>
    </Box>
  );
};

export default ExternalFilter;
