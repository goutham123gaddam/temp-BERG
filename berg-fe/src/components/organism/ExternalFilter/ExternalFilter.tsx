import React, { useState, useEffect } from 'react';
import { Box, Badge } from '@mui/material';
import ButtonComponent from '../../atoms/Button/Button';
import BaseMenu from '../../atoms/Menu/Menu';
import BaseAccordion from '../../atoms/BaseAccordion/BaseAccordion';
import RadioGroupFilter from '../../molecules/RadioGroupFilter/RadioGroupFilter';
import CheckboxGroupFilter from '../../molecules/CheckboxGroupFilter/CheckboxGroupFilter';

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
  showBadge?: boolean;
};

const ExternalFilter = ({
  groupedOptions,
  triggerLabel = 'Filter',
  applyButtonLabel = 'Apply Filter',
  onApplyFilter,
  icon,
  showBadge = true,
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

  const handleClear = () => {
    setSelectedValues({});
    setSelectedCheckboxes({});
  };

  // Calculate total selected items for badge
  const totalSelected = React.useMemo(() => {
    const radioSelected = Object.values(selectedValues).filter(v => v.trim() !== '').length;
    const checkboxSelected = Object.values(selectedCheckboxes).reduce((sum, arr) => sum + arr.length, 0);
    return radioSelected + checkboxSelected;
  }, [selectedValues, selectedCheckboxes]);

  // Display label with selection count
  const displayLabel = React.useMemo(() => {
    if (totalSelected === 0) return triggerLabel;
    return `${triggerLabel} (${totalSelected})`;
  }, [triggerLabel, totalSelected]);

  return (
    <Box>
      <Badge 
        badgeContent={showBadge && totalSelected > 0 ? totalSelected : 0} 
        color="primary"
        invisible={!showBadge || totalSelected === 0}
      >
        <ButtonComponent 
          buttonVariant={totalSelected > 0 ? "primary" : "secondary"} 
          onClick={handleClick}
        >
          <Box display={'flex'} alignItems={'center'} gap={1}>
            {icon && icon}
            {displayLabel}
          </Box>
        </ButtonComponent>
      </Badge>

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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 1 }}>
          <ButtonComponent 
            buttonVariant="secondary" 
            onClick={handleClear}
            sx={{ flex: 1 }}
          >
            Clear
          </ButtonComponent>
          <ButtonComponent 
            buttonVariant="primary" 
            onClick={handleApply}
            sx={{ flex: 1 }}
          >
            {applyButtonLabel}
          </ButtonComponent>
        </Box>
      </BaseMenu>
    </Box>
  );
};

export default ExternalFilter;