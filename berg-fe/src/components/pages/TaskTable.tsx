import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Drawer
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import DataTable from '../organism/DataTable/DataTable';
import ButtonComponent from '../atoms/Button/Button';
import SearchInput from '../molecules/SearchInput/SearchInput';
import CreateTaskDrawer from '../organism/CreateTaskDrawer/CreateTaskDrawer';
import { fetchTasks, deleteTask, clearErrors } from '../../features/task/taskSlice';
import { useSnackbar } from '../../hooks/useSnackbar';
import type { RootState, AppDispatch } from '../../app/store';

interface TaskTableProps {
  batch: any;
  onBack: () => void;
}

const statusStyles = {
  pending: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  annotation_inprogress: { backgroundColor: '#fef3c7', color: '#92400e' },
  annotation_inreview: { backgroundColor: '#e0f2fe', color: '#0369a1' },
  completed: { backgroundColor: '#d1fae5', color: '#059669' },
  in_progress: { backgroundColor: '#fef3c7', color: '#92400e' },
  failed: { backgroundColor: '#fecaca', color: '#dc2626' },
};

export default function TaskTable({ batch, onBack }: TaskTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, loading, error, isDeleteLoading } = useSelector((state: RootState) => state.tasks);
  const { success, error: showError } = useSnackbar();
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (batch?.id) {
      dispatch(fetchTasks(batch.id));
    }
  }, [batch, dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    if (batch?.id) {
      dispatch(fetchTasks(batch.id));
    }
  };

  const handleView = (task: any) => {
    setSelectedTask(task);
    setShowViewDrawer(true);
  };

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setEditMode(true);
    setShowCreateDrawer(true);
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await dispatch(deleteTask(taskToDelete)).unwrap();
      success('Task deleted successfully!');
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      showError('Failed to delete task. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleCreateNew = () => {
    setSelectedTask(null);
    setEditMode(false);
    setShowCreateDrawer(true);
  };

  const handleDrawerClose = () => {
    setShowCreateDrawer(false);
    setEditMode(false);
    setSelectedTask(null);
  };

  // Filter tasks based on search
  const filteredTasks = React.useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.id.toLowerCase().includes(query) ||
      task.taskType.toLowerCase().includes(query) ||
      task.assignedUser.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const getStatusChip = (status: string) => {
    const style = statusStyles[status as keyof typeof statusStyles] || 
                 { backgroundColor: '#e5e7eb', color: '#374151' };
    
    return (
      <Chip
        label={status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        sx={{
          backgroundColor: style.backgroundColor,
          color: style.color,
          fontWeight: 600,
          textTransform: 'capitalize'
        }}
        size="small"
      />
    );
  };

  const columns = [
    {
      title: 'ID',
      field: 'id',
      render: (rowData: string) => (
        <Typography variant="body2" fontFamily="monospace">
          {rowData.slice(0, 8)}...
        </Typography>
      )
    },
    {
      title: 'Task Type',
      field: 'taskType',
      render: (rowData: string) => (
        <Typography variant="body2">{rowData}</Typography>
      )
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData: string) => getStatusChip(rowData)
    },
    {
      title: 'Assigned User',
      field: 'assignedUser',
      render: (rowData: string) => (
        <Typography variant="body2">{rowData}</Typography>
      )
    },
    {
      title: 'Created At',
      field: 'createdAt',
      render: (rowData: string) => (
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
          <IconButton 
            size="small" 
            onClick={() => handleView(row)}
            sx={{ color: 'primary.main' }}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleEdit(row)}
            sx={{ color: 'warning.main' }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDeleteClick(rowData)}
            disabled={isDeleteLoading}
            sx={{ color: 'error.main' }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  const rows = filteredTasks.map(task => ({
    id: task.id,
    taskType: task.taskType,
    status: task.status,
    assignedUser: task.assignedUser,
    createdAt: task.createdAt,
    ...task // Include all task data for actions
  }));

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={onBack} sx={{ color: 'primary.main' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              All Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Batch: {batch?.batchName}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
        <Box display="flex" gap={2} flex={1}>
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search task by ID or Type"
            sx={{ maxWidth: 400 }}
          />
          <ButtonComponent
            buttonVariant="secondary"
            onClick={handleRefresh}
            sx={{ whiteSpace: 'nowrap' }}
          >
            <RefreshIcon sx={{ mr: 1 }} />
            Refresh Tasks
          </ButtonComponent>
        </Box>

        <ButtonComponent
          buttonVariant="primary"
          onClick={handleCreateNew}
        >
          <AddOutlinedIcon sx={{ mr: 1 }} />
          New Task
        </ButtonComponent>
      </Box>

      {/* Results Info */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredTasks.length} of {tasks.length} tasks
          {searchQuery && ` matching "${searchQuery}"`}
        </Typography>
      </Box>

      {/* Table */}
      <Box>
        {loading ? (
          <Box p={3} display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            Loading tasks...
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error}
          </Alert>
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </Box>

      {/* View Task Drawer */}
      <Drawer
        anchor="right"
        open={showViewDrawer}
        onClose={() => setShowViewDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 500,
            padding: 3
          }
        }}
      >
        {selectedTask && (
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Task Details
            </Typography>
            
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Task ID:</Typography>
              <Typography variant="body2" fontFamily="monospace">{selectedTask.id}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Task Type:</Typography>
              <Typography variant="body2">{selectedTask.taskType}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Status:</Typography>
              {getStatusChip(selectedTask.status)}
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Assigned User:</Typography>
              <Typography variant="body2">{selectedTask.assignedUser}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Batch ID:</Typography>
              <Typography variant="body2" fontFamily="monospace">{selectedTask.batchId}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Created At:</Typography>
              <Typography variant="body2">
                {new Date(selectedTask.createdAt).toLocaleString()}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Inputs:</Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#f5f5f5',
                  padding: 2,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                {JSON.stringify(selectedTask.inputs, null, 2)}
              </Box>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold">Outputs:</Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#f5f5f5',
                  padding: 2,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                {JSON.stringify(selectedTask.outputs, null, 2)}
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Create/Edit Task Drawer */}
      {showCreateDrawer && (
        <CreateTaskDrawer
          batch={batch}
          onClose={handleDrawerClose}
          existingTask={editMode ? selectedTask : null}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isDeleteLoading}
          >
            {isDeleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}