import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
  title: string;
  children: React.ReactNode;
};

const BaseAccordion = ({ title, children }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const handleChange = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Accordion
      defaultExpanded
      expanded={expanded}
      onChange={handleChange}
      disableGutters
      elevation={0}
      square
      sx={{
        borderBottom: '1px solid #eee',
        backgroundColor: 'transparent',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography  variant="body1" color="text.secondary">
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 1 }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default BaseAccordion;
