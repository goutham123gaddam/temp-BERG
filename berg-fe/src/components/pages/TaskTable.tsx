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
  Drawer,
  Tooltip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import DataTable from '../organism/DataTable/DataTable';
import ButtonComponent from '../atoms/Button/Button';
import SearchInput from '../molecules/SearchInput/SearchInput';
import CreateTaskDrawer from '../organism/CreateTaskDrawer/CreateTaskDrawer';
import { fetchTasks, deleteTask, updateTask, updateTaskStatus, clearErrors } from '../../features/task/taskSlice';
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
  const { items: tasks, loading, error, isDeleteLoading, isUpdateLoading, isStatusUpdateLoading } = useSelector((state: RootState) => state.tasks);
  const { success, error: showError } = useSnackbar();
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

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

  // Handle status updates
  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    setStatusUpdateLoading(taskId);
    try {
      await dispatch(updateTaskStatus({ id: taskId, status: newStatus })).unwrap();
      
      const statusText = newStatus.replace('_', ' ');
      success(`Task marked as ${statusText}!`);
      
    } catch (error) {
      showError('Failed to update task status. Please try again.');
    } finally {
      setStatusUpdateLoading(null);
    }
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

  // Render status action buttons based on current status
  const renderStatusActions = (task: any) => {
    const { id, status } = task;
    const isLoading = statusUpdateLoading === id;

    switch (status) {
      case 'pending':
        return (
          <Tooltip title="Mark as In Progress">
            <IconButton
              size="small"
              onClick={() => handleStatusUpdate(id, 'in_progress')}
              disabled={isLoading || isUpdateLoading || isStatusUpdateLoading}
              sx={{ color: 'warning.main' }}
            >
              {isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <PlayArrowIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        );
      
      case 'in_progress':
        return (
          <Tooltip title="Mark as Completed">
            <IconButton
              size="small"
              onClick={() => handleStatusUpdate(id, 'completed')}
              disabled={isLoading || isUpdateLoading || isStatusUpdateLoading}
              sx={{ color: 'success.main' }}
            >
              {isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <CheckCircleIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        );
      
      case 'completed':
        return (
          <Chip
            label="Complete"
            size="small"
            sx={{
              backgroundColor: '#d1fae5',
              color: '#059669',
              fontWeight: 600
            }}
          />
        );
      
      default:
        return null;
    }
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
      title: 'Status Actions',
      field: 'id',
      render: (rowData: string, row: any) => (
        <Box display="flex" alignItems="center" justifyContent="center">
          {renderStatusActions(row)}
        </Box>
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
            disabled={row.status === 'completed'}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDeleteClick(rowData)}
            disabled={isDeleteLoading || row.status === 'completed'}
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
              Tasks - {batch?.batchName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage tasks for this batch
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          <ButtonComponent
            buttonVariant="secondary"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </ButtonComponent>
          <ButtonComponent
            buttonVariant="primary"
            onClick={handleCreateNew}
            startIcon={<AddOutlinedIcon />}
          >
            Create New Task
          </ButtonComponent>
        </Box>
      </Box>

      {/* Search */}
      <Box mb={3}>
        <SearchInput 
          placeholder="Search tasks..." 
          onSearch={handleSearch}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Task Statistics */}
      <Box display="flex" gap={2} mb={3}>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {filteredTasks.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Tasks
          </Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            {filteredTasks.filter(task => task.status === 'completed').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed
          </Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="warning.main">
            {filteredTasks.filter(task => task.status === 'in_progress').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In Progress
          </Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="error.main">
            {filteredTasks.filter(task => task.status === 'pending').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending
          </Typography>
        </Box>
      </Box>

      {/* Data Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
        />
      )}

      {/* Create/Edit Task Drawer */}
      <CreateTaskDrawer
        batch={batch}
        open={showCreateDrawer}
        onClose={handleDrawerClose}
        existingTask={editMode ? selectedTask : null}
      />

      {/* View Task Drawer (if you have one) */}
      {showViewDrawer && (
        <Drawer
          anchor="right"
          open={showViewDrawer}
          onClose={() => setShowViewDrawer(false)}
        >
          <Box sx={{ width: 400, p: 3 }}>
            <Typography variant="h6" mb={2}>
              Task Details
            </Typography>
            {selectedTask && (
              <Box>
                <Typography variant="body2" mb={1}>
                  <strong>ID:</strong> {selectedTask.id}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <strong>Type:</strong> {selectedTask.taskType}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <strong>Status:</strong> {selectedTask.status}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <strong>Assigned User:</strong> {selectedTask.assignedUser}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <strong>Created:</strong> {new Date(selectedTask.createdAt).toLocaleString()}
                </Typography>
                {selectedTask.completedAt && (
                  <Typography variant="body2" mb={1}>
                    <strong>Completed:</strong> {new Date(selectedTask.completedAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Drawer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleteLoading}
          >
            {isDeleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}