import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography, Avatar } from '@mui/material';
import BaseAccordion from '../atoms/BaseAccordion/BaseAccordion';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import DataTable from '../organism/DataTable/DataTable';
import { useBatches } from '../../hooks/useBatch';
import ButtonComponent from '../atoms/Button/Button';

import { useParams } from 'react-router-dom';
import { BATCH_FILTER_OPTION } from '../../constant';


import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

import SearchInput from '../molecules/SearchInput/SearchInput';
import ExternalFilter from '../organism/ExternalFilter/ExternalFilter';
import StatusChip from '../atoms/StatusChip/StatusChip';


function Batch() {
  const { projectId } = useParams();


  const { batches, loading, error, fetchBatches, resetBatches } = useBatches();
  console.log(batches);
  React.useEffect(() => {
    if (projectId) {
      fetchBatches(projectId);
    }

    // optional cleanup
    return () => {
      resetBatches();
    };
  }, [projectId]);


  const rows = (Array.isArray(batches) ? batches : []).map((batch) => ({
    batchId: batch.id,
    batchName: batch.batchName,
    Progress: batch.Progress,
    Status: batch.slaStatus,
    Eta: '5 Days',
    Status2: batch?.progress === 100 ? 'Completed' : 'Active',
    btn: batch.id,
    Manage: 'Manage',
  }));


  const columns = [
    {
      title: () => <Box>Batch ID</Box>,
      field: 'batchName',
      render: (rowData: string) => (
        <Box width="100%">
          <Box display="flex" alignItems="center" gap={2}>
          
            <Box>
              <Typography fontWeight={500}>{rowData}</Typography>
            

            </Box>
          </Box>
        </Box>
      )
    },
    {
      title: 'Project  Name', field: 'client',
      render: (rowData: string) => <Typography>Product Color Annotation</Typography>
    },
    {
      title: 'Progress', field: 'Progress',
      render: (rowData: string) => (
        <Box p={1}>
           <Box >
             <Typography fontWeight={500}>{rowData}0%</Typography>
              <LinearProgress variant="determinate" value={2} />
            </Box>
        </Box>
      )
    },
{
  title: 'SLA Status',
  field: 'Status',
  render: (rowData: string) => {
    let color = '#019564'; // default color

    if (rowData === 'On Track') {
      color = 'green';
    } else if (rowData === 'At Risk') {
      color = '#981B1B';
    }

    return <StatusChip label={rowData} color={color} />;
  }
}
,
   {
      title: 'Actions', field: 'btn',
      render: (rowData: string) => (
        <ButtonComponent buttonVariant="secondary" sx={{ p: 1, px: 1, gap: 1 }} onClick={()=>{}}>
          <VisibilityOutlinedIcon />
          View Task
        </ButtonComponent>
      )
    },
       {
      title: '', field: 'btn',
      render: (rowData: string) => (
        <ButtonComponent buttonVariant="secondary" sx={{ p: 1, gap: 1 }} onClick={()=>{}}>
          <GroupsOutlinedIcon />
    
        </ButtonComponent>
      )
    }
  
  ];
  return (
    <>
      <Box>
        <Box display="flex">

          <Box flex={1} display="flex" flexDirection="column" gap={1}>
            <Typography variant="h5" fontWeight={600}>Batch Management</Typography>
            <Typography variant="body1">Manage your annotation batches and monitor progress</Typography>
          </Box>
          <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
            <ButtonComponent buttonVariant="secondary" sx={{ height: '56px', width: '150px' }}>
              <Box display="flex" alignItems="center">

                <span>Import CSV</span>
              </Box>
            </ButtonComponent>
            <ButtonComponent buttonVariant="primary" sx={{ height: '56px', width: '200px' }}>
              <AddOutlinedIcon />
              New Batch
            </ButtonComponent>
            <ButtonComponent buttonVariant="secondary" sx={{ height: '56px', width: '200px' }}>
              <BaseAccordion title="View all projects">
                <div></div>


              </BaseAccordion>
            </ButtonComponent>

            {/* <DrawerFrom open={openDrawer} onOpen={() => setOpenDrawer(true)} onClose={() => setOpenDrawer(false)} /> */}
          </Box>

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
                groupedOptions={BATCH_FILTER_OPTION}
                onApplyFilter={() => { }}
              /> 
          </Box>

        </Box>
                  <Box>
            <DataTable columns={columns} rows={rows} />
          </Box>
      </Box>
    </>
  )
}

export default Batch