
import * as React from 'react';
import Box from '@mui/material/Box';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { Typography, Avatar } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
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



import { useTeams } from '../../hooks/useTeam';
import { PROJECT_FILTER_DATE, PROJECT_FILTER_OPTION, ROUTES_FRONTEND as ROUTES } from '../../constant';
import { date } from 'yup';
function Team() {

      const [dateFilterLabel, setDateFilterLabel] = React.useState('Today');
    
     
      const handleDateFilterApply = (
        selectedValues: Record<string, string>,
      ) => {
    
        if (selectedValues['DATE']) {
          setDateFilterLabel(selectedValues['DATE']);
        } else {
          setDateFilterLabel('Filtered');
        }
      };
        const { teams, loading, error } = useTeams();
   console.log(teams);
//   if (loading) return <p>Loading teams...</p>;
//   if (error) return <p>Error: {error}</p>;


  const columns = [
    {
      title: () => <Box>User</Box>,
      field: 'User',
   
    },
    {
      title: 'Email', field: 'email',
      render: (rowData: string) => <Typography>{rowData}</Typography>
    },
    {
      title: 'Phone Number', field: 'PhoneNumber'
     
    },
    {
      title: 'Role', field: 'Role'
   
    },

    {
      title: 'Status', field: 'Status',
      render: (rowData: string) => <StatusChip label={rowData} color="#019568" />
    },
    {
      title: 'Start date', field: 'Startdate',
 
    },
    {
      title: 'Project Access List', field: 'ProjectAccessList',

    }
  ];

  const rows = (Array.isArray(teams) ? teams : []).map((team) => ({
    User: team?.raw_user_meta_data?.role === ''? team?.raw_user_meta_data?.role :'test#user',
    email: team?.email,
    PhoneNumber: '+234 812 345 6789',
    Role: team?.raw_user_meta_data?.role != '' ? team?.raw_user_meta_data?.role : "test",
    Status: team?.progress === 100 ? 'Completed' : 'Active',
    Startdate: "2024-08-12",
      ProjectAccessList: "All Projects",
 
  }));
  return (  
       <Box>
      <Box display="flex">
        <Box flex={1} display="flex" flexDirection="column" gap={1}>
          <Typography variant="h5">Team Management</Typography>
          <Typography variant="body1">View and take actions on your team list</Typography>
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
          <ButtonComponent buttonVariant="secondary" sx={{ height: '56px', width: '150px' }}>
            <Box display="flex" alignItems="center">
              <SimCardDownloadOutlinedIcon />
              <span>Import CSV</span>
            </Box>
          </ButtonComponent>
       
          <ButtonComponent buttonVariant="primary" sx={{ height: '56px', width: '200px' }}>
            <AddOutlinedIcon />
             Add Team member
          </ButtonComponent>
          {/* <DrawerFrom open={} onOpen={() => {}} onClose={() => ""} /> */}
        </Box>
      </Box>
      
          <Box px={2} py={2} display="flex" alignItems="center" gap={2} borderBottom="1px solid #F0F2F5">
        <SearchInput
          onSearch={() => { }}
          placeholder="Search  client name"
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
        <DataTable columns={columns} rows={rows} />
      </Box>
  )
}

export default Team