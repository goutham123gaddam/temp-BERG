// src/components/molecules/ProjectHeaderSection/ProjectHeaderSection.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ButtonComponent from '../../atoms/Button/Button';

interface ProjectHeaderSectionProps {
  title?: string;
  subtitle?: string;
  onImportCSV?: () => void;
  onTeamManagement?: () => void;
  onCreateProject?: () => void;
  showImportButton?: boolean;
  showTeamButton?: boolean;
  showCreateButton?: boolean;
  createLabel?: string;
  importLabel?: string;
  teamLabel?: string;
  drawerComponent?: React.ReactNode;
}

const TextandButtonSection: React.FC<ProjectHeaderSectionProps> = ({
  title = 'All Projects',
  subtitle = 'This screen helps you manage your annotation and tasks',
  onImportCSV,
  onTeamManagement,
  onCreateProject,
  showImportButton = true,
  showTeamButton = true,
  showCreateButton = true,
  createLabel = 'Create Project',
  importLabel = 'Import CSV',
  teamLabel = 'Team Management',
  drawerComponent,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      {/* Left Side */}
      <Box flex={1} display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body1">{subtitle}</Typography>
      </Box>

      {/* Right Side */}
      <Box flex={1} display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
        {showImportButton && (
          <ButtonComponent
            buttonVariant="secondary"
            sx={{ height: '56px', width: '150px' }}
            onClick={onImportCSV}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <SimCardDownloadOutlinedIcon />
              <span>{importLabel}</span>
            </Box>
          </ButtonComponent>
        )}

        {showTeamButton && (
          <ButtonComponent
            buttonVariant="secondary"
            sx={{ height: '56px', width: '200px' }}
            onClick={onTeamManagement}
          >
            <GroupsOutlinedIcon sx={{ mr: 1 }} />
            {teamLabel}
          </ButtonComponent>
        )}

        {showCreateButton && (
          <ButtonComponent
            buttonVariant="primary"
            sx={{ height: '56px', width: '200px' }}
            onClick={onCreateProject}
          >
            <AddOutlinedIcon sx={{ mr: 1 }} />
            {createLabel}
          </ButtonComponent>
        )}

        {drawerComponent}
      </Box>
    </Box>
  );
};

export default TextandButtonSection;
