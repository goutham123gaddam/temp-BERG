import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PercentIcon from '@mui/icons-material/Percent';
import DataTable from '../organism/DataTable/DataTable';
import ButtonComponent from '../atoms/Button/Button';
import CountBox from '../molecules/CountBox/CountBox';
import SearchInput from '../molecules/SearchInput/SearchInput';
import ExternalFilter from '../organism/ExternalFilter/ExternalFilter';
import StatusChip from '../atoms/StatusChip/StatusChip';
import ProgressCircle from '../molecules/ProgressCircle/ProgressCircle';

import DrawerFrom from '../organism/DrawerFrom/DrawerFrom';

import { useProjects } from '../../hooks/useProjects';
import { PROJECT_FILTER_DATE, PROJECT_FILTER_OPTION, ROUTES_FRONTEND as ROUTES } from '../../constant';

export default function Project() {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const { projects, error } = useProjects();
  const navigate = useNavigate();


  const [dateFilterLabel, setDateFilterLabel] = React.useState('Today');

  const handleView = (projectId: string) => {
    navigate(ROUTES.BATCH.replace(':projectId', projectId));
  };



  const handleDateFilterApply = (
    selectedValues: Record<string, string>,
  ) => {

    if (selectedValues['DATE']) {
      setDateFilterLabel(selectedValues['DATE']);
    } else {
      setDateFilterLabel('Filtered');
    }
  };

  const columns = [
    {
      title: () => <Box>Project Name</Box>,
      field: 'name',
      render: (rowData: string) => (
        <Box width="100%">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ color: '#744DCD', bgcolor: '#E8DEFD' }}>B</Avatar>
            <Box>
              <Typography fontWeight={500}>{rowData}</Typography>
              <Typography fontSize={13} color="text.secondary">
                203, 111 tasks
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    },
    {
      title: 'Client', field: 'client',
      render: (rowData: string) => <Typography>{rowData}</Typography>
    },
    {
      title: '%Done', field: 'Progress',
      render: (rowData: string) => (
        <Box p={1}>
          <ProgressCircle value={parseFloat(rowData)} />
        </Box>
      )
    },
    {
      title: 'Gold Accuracy', field: 'Accuracy',
      render: (rowData: string) => <StatusChip label={rowData} color="#744DCD" />
    },
    { title: 'ETA', field: 'Eta' },
    {
      title: 'Status', field: 'Status',
      render: (rowData: string) => <StatusChip label={rowData} color="#019568" />
    },
    {
      title: 'Actions', field: 'btn',
      render: (rowData: string) => (
        <ButtonComponent buttonVariant="primary" sx={{ p: 1, px: 2, gap: 1 }} onClick={() => handleView(rowData)}>
          <VisibilityOutlinedIcon />
          View
        </ButtonComponent>
      )
    },
    {
      title: '', field: 'Manage',
      render: (rowData: string) => (
        <ButtonComponent buttonVariant="secondary" sx={{ p: 1 }}>
          <SettingsOutlinedIcon sx={{ mr: 1 }} />
          {rowData}
        </ButtonComponent>
      )
    }
  ];

  const rows = (Array.isArray(projects) ? projects : []).map((project) => ({
    name: project.projectName,
    client: project.owner,
    Progress: '0',
    Accuracy: '54.6%',
    Eta: '5 Days',
    Status: project?.progress === 100 ? 'Completed' : 'Active',
    btn: project.id,
    Manage: 'Manage',
  }));

  if (error) return <Box p={3} color="red">Failed to load projects.</Box>;

  return (
    <Box>
      <Box display="flex">
        <Box flex={1} display="flex" flexDirection="column" gap={1}>
          <Typography variant="h5">All Projects</Typography>
          <Typography variant="body1">This screen helps you manage your annotation and tasks</Typography>
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
          <ButtonComponent buttonVariant="secondary" sx={{ height: '56px', width: '150px' }}>
            <Box display="flex" alignItems="center">
              <SimCardDownloadOutlinedIcon />
              <span>Import CSV</span>
            </Box>
          </ButtonComponent>
          <ButtonComponent buttonVariant="secondary" sx={{ height: '56px', width: '200px' }}>
            <GroupsOutlinedIcon sx={{ ml: '5px' }} />
            Team Management
          </ButtonComponent>
          <ButtonComponent buttonVariant="primary" sx={{ height: '56px', width: '200px' }} onClick={() => setOpenDrawer(true)}>
            <AddOutlinedIcon />
            Create Project
          </ButtonComponent>
          <DrawerFrom open={openDrawer} onOpen={() => setOpenDrawer(true)} onClose={() => setOpenDrawer(false)} />
        </Box>
      </Box>

      <Box flex={1} display="flex" gap={4} py={2}>
        <CountBox label="Total No of projects" count="100" color="#744DCD" icon={<MenuBookOutlinedIcon />} />
        <CountBox label="Total task done" count="40" color="#744DCD" icon={<AssignmentReturnedIcon />} />
        <CountBox label="Accuracy Count" count="30%" color="#744DCD" icon={<PercentIcon />} />
      </Box>

      <Box px={2} py={2} display="flex" alignItems="center" gap={2} borderBottom="1px solid #F0F2F5">
        <SearchInput
          onSearch={() => { }}
          placeholder="Search by project name, status, client name"
          sx={{ background: '#F7F9FC', flex: 1 }}
        />

        <Box display="flex" alignItems="center" gap={2} flex={1}>
           <ExternalFilter
              icon={<FilterAltOutlinedIcon />}
              triggerLabel="Filter"
              applyButtonLabel="Apply Filter"
             
              groupedOptions={PROJECT_FILTER_OPTION}
            />

          <ExternalFilter
            icon={<CalendarMonthOutlinedIcon />}
            triggerLabel={dateFilterLabel}
            applyButtonLabel="Apply Filter"
            groupedOptions={PROJECT_FILTER_DATE}
            onApplyFilter={handleDateFilterApply}
          />
        </Box>
      </Box>

      <Box>
        <DataTable columns={columns} rows={rows} />
      </Box>
    </Box>
  );
}
