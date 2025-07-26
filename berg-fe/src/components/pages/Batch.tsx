import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Avatar, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DrawerBtachForm from '../organism/DrawerBatchFrom/DrawerBatchFrom'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DataTable from '../organism/DataTable/DataTable';
import ButtonComponent from '../atoms/Button/Button';
import SearchInput from '../molecules/SearchInput/SearchInput';
import ExternalFilter from '../organism/ExternalFilter/ExternalFilter';
import BaseAccordion from '../atoms/BaseAccordion/BaseAccordion';
import TaskTable from './TaskTable'; // Import the TaskTable component
import { useBatches } from '../../hooks/useBatch';
import { BATCH_FILTER_OPTION } from '../../constant';
import { useSnackbar } from '../../hooks/useSnackbar';

export default function Batch() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { batches, loading, error, removeBatch } = useBatches(projectId);
  const { success, error: showError } = useSnackbar();
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null);
  // State for task navigation
  const [currentView, setCurrentView] = useState<'batches' | 'tasks'>('batches');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDrawer, setOpenDrawer] = React.useState(false);

  // --- Move these handlers to top level ---
  const handleDeleteClick = (batchId: string) => {
    setProjectToDelete(batchId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsDeleteLoading(true);
    try {
      await removeBatch(projectToDelete);
      success('Batch deleted successfully!');
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      showError('Failed to delete batch. Please try again.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };
  // --- End move ---

  console.log(batches);
  // React.useEffect(() => {
  //   if (projectId) {
  //     fetchBatches(projectId);
  //   }

  //   // optional cleanup
  //   return () => {
  //     resetBatches();
  //   };
  // }, [projectId]);

  const handleViewTasks = (batch: any) => {
    setSelectedBatch(batch);
    setCurrentView('tasks');
  };

  const handleBackToBatches = () => {
    setCurrentView('batches');
    setSelectedBatch(null);
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter batches based on search
  const filteredBatches = React.useMemo(() => {
    if (!searchQuery.trim()) return batches || [];
    
    const query = searchQuery.toLowerCase();
    return (batches || []).filter(batch => 
      batch.batchName?.toLowerCase().includes(query) ||
      batch.slaStatus?.toLowerCase().includes(query)
    );
  }, [batches, searchQuery]);

  // If viewing tasks, render TaskTable
  if (currentView === 'tasks' && selectedBatch) {
    return (
      <TaskTable 
        batch={selectedBatch} 
        onBack={handleBackToBatches}
      />
    );
  }

  // Get SLA status chip styling
  const getSlaStatusChipStyle = (status: string) => {
    const styles = {
      on_track: { backgroundColor: '#d1fae5', color: '#059669' },
      at_risk: { backgroundColor: '#fef3c7', color: '#92400e' },
      overdue: { backgroundColor: '#fee2e2', color: '#dc2626' }
    };
    return styles[status as keyof typeof styles] || { backgroundColor: '#e5e7eb', color: '#374151' };
  };

  // Batch table columns
  const columns = [
    {
      title: () => <Box>Batch Name</Box>,
      field: 'batchName',
      render: (rowData: string, row: any) => (
        <Box width="100%">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ color: '#744DCD', bgcolor: '#E8DEFD' }}>
              {rowData?.charAt(0)?.toUpperCase() || 'B'}
            </Avatar>
            <Box>
              <Typography fontWeight={500}>{rowData}</Typography>
              <Typography fontSize={13} color="text.secondary">
                {row.totalTasks || 0} tasks ({row.completedTasks || 0} completed)
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    },
    {
      title: 'Due Date',
      field: 'dueDate',
      render: (rowData: string, row: any) => (
        <Typography variant="body2">
          {new Date(rowData).toLocaleDateString()}
        </Typography>
      )
    },
    {
      title: 'Progress',
      field: 'progress',
      render: (rowData: string, row: any) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 60,
              height: 8,
              backgroundColor: '#e5e7eb',
              borderRadius: 4,
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                width: `${Number(rowData) || 0}%`,
                height: '100%',
                backgroundColor: (Number(rowData) || 0) === 100 ? '#059669' : '#3b82f6',
                transition: 'width 0.3s ease'
              }}
            />
          </Box>
          <Typography variant="body2" fontSize={12} minWidth={35}>
            {Number(rowData) || 0}%
          </Typography>
        </Box>
      )
    },
    {
      title: 'SLA Status',
      field: 'slaStatus',
      render: (rowData: string, row: any) => (
        <Box sx={{ ...getSlaStatusChipStyle(rowData), borderRadius: 2, px: 1, py: 0.5 }}>
          {rowData.replace('_', ' ')}
        </Box>
      )
    },
    {
      title: 'Accuracy',
      field: 'accuracy',
      render: (rowData: string, row: any) => (
        <Typography variant="body2" color={Number(rowData) > 80 ? 'success.main' : 'warning.main'}>
          {rowData ? `${rowData}%` : 'N/A'}
        </Typography>
      )
    },
    {
      title: 'Created At',
      field: 'createdAt',
      render: (rowData: string, row: any) => (
        <Typography variant="body2">
          {new Date(rowData).toLocaleDateString()}
        </Typography>
      )
    },
    {
      title: 'Actions',
      field: 'id',
      render: (rowData: string, row: any) => (
        <Box display="flex" gap={1}>
          <ButtonComponent 
            buttonVariant="secondary" 
            sx={{ p: 1, px: 1, gap: 1 }}
            onClick={() => handleViewTasks(row)}
          >
            <VisibilityOutlinedIcon />
            View Tasks
          </ButtonComponent>
          <ButtonComponent 
            buttonVariant="secondary" 
            sx={{ p: 1, gap: 1 }}
          >
            <GroupsOutlinedIcon />
          </ButtonComponent>
          <ButtonComponent 
            buttonVariant="secondary" 
            sx={{ p: 1, minWidth: 'auto' }}
            onClick={() => handleDeleteClick(rowData)}
            disabled={isDeleteLoading}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </ButtonComponent>
        </Box>
      )
    }
  ];


  const rows = filteredBatches.map((batch) => ({
    id: batch.id,
    batchName: batch.batchName,
    dueDate: batch.dueDate,
    progress: batch.progress || 0,
    slaStatus: batch.slaStatus || 'on_track',
    accuracy: batch.accuracy || 0,
    createdAt: batch.createdAt,
    totalTasks: batch.totalTasks || 0,
    completedTasks: batch.completedTasks || 0,
    pendingTasks: batch.pendingTasks || 0,
    inProgressTasks: batch.inProgressTasks || 0,
    // ...batch // Do not spread batch to avoid duplicate keys
  }));

  return (
    <Box>
      {/* Header Section */}
      <Box display="flex">
        <Box flex={1} display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={2}>
            <ButtonComponent 
              buttonVariant="secondary" 
              onClick={handleBackToProjects}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <ArrowBackIcon />
            </ButtonComponent>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Batch Management
              </Typography>
              <Typography variant="body1">
                Manage your annotation batches and monitor progress
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box flex={1} display="flex" justifyContent="flex-end" gap={1}>
          <ButtonComponent buttonVariant="secondary" sx={{ height: '56px', width: '150px' }}>
            <Box display="flex" alignItems="center">
              <SimCardDownloadOutlinedIcon />
              <span>Import CSV</span>
            </Box>
          </ButtonComponent>
          
          <ButtonComponent buttonVariant="primary" sx={{ height: '56px', width: '200px' }} onClick={() => setOpenDrawer(true)}>
            <AddOutlinedIcon />
            New Batch
          </ButtonComponent>
                <DrawerBtachForm
              open={openDrawer}
              onOpen={() => setOpenDrawer(true)}
              onClose={() => setOpenDrawer(false)}
              projectId={projectId ?? ""}
            />

        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Box px={2} py={2} display="flex" alignItems="center" gap={2} borderBottom="1px solid #F0F2F5">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search by batch name, status"
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

      {/* Results Info */}
      <Box px={2} py={1}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredBatches.length} of {batches?.length || 0} batches
          {searchQuery && ` matching "${searchQuery}"`}
        </Typography>
      </Box>

      {/* Data Table */}
      <Box>
        {loading ? (
          <Box p={3} display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            Loading batches...
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            Error loading batches: {error}
          </Alert>
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this batch? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={isDeleteLoading}>
            {isDeleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}