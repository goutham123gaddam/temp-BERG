import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import { fetchAllTasks } from '../../../features/task/taskSlice';
import CountBox from '../../molecules/CountBox/CountBox';
import DataTable from '../DataTable/DataTable';
import SearchInput from '../../molecules/SearchInput/SearchInput';
import ButtonComponent from '../../atoms/Button/Button';
import TaskCard from '../../molecules/TaskCard/TaskCard'; // Import TaskCard
import type { RootState, AppDispatch } from '../../../app/store';

interface AdminTasksViewProps {
  userName: string;
}

const AdminTasksView: React.FC<AdminTasksViewProps> = ({ userName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  useEffect(() => {
    // Apply search filtering
    if (searchQuery.trim()) {
      const filtered = tasks.filter(task =>
        task.taskType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedUser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.batch?.project?.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.templateData?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, searchQuery]);

  const handleRefresh = () => {
    dispatch(fetchAllTasks());
  };

  const handleViewTask = (taskId: string) => {
    // TODO: Navigate to task details view
    console.log('Viewing task:', taskId);
  };

  // Calculate statistics
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    inProgressTasks: tasks.filter(task => task.status === 'in_progress').length,
    pendingTasks: tasks.filter(task => task.status === 'pending').length,
    uniqueAnnotators: new Set(tasks.map(task => task.assignedUser)).size,
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  // Table columns for admin view
  const columns = [
    {
      title: 'Task',
      field: 'taskType',
      render: (rowData: string, row: any) => (
        <Box>
          <Typography fontWeight={500}>{rowData}</Typography>
          <Typography variant="body2" color="text.secondary">
            {row.templateType || 'Standard Task'}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Project/Batch',
      field: 'batch',
      render: (rowData: any, row: any) => (
        <Box>
          <Typography fontWeight={500}>
            {rowData?.project?.projectName || 'Unknown Project'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {rowData?.batchName || 'Unknown Batch'}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Assigned To',
      field: 'assignedUser',
      render: (rowData: string) => (
        <Typography variant="body2">
          {rowData?.split('@')[0] || rowData}
        </Typography>
      )
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData: string) => {
        const statusColors = {
          pending: { backgroundColor: '#fee2e2', color: '#b91c1c' },
          in_progress: { backgroundColor: '#fef3c7', color: '#92400e' },
          completed: { backgroundColor: '#d1fae5', color: '#059669' },
          failed: { backgroundColor: '#fecaca', color: '#dc2626' },
        };
        
        return (
          <Chip
            label={rowData.replace('_', ' ')}
            size="small"
            sx={statusColors[rowData as keyof typeof statusColors] || {}}
          />
        );
      }
    },
    {
      title: 'Created',
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
          <Button size="small" variant="outlined" onClick={() => handleViewTask(rowData)}>
            View
          </Button>
          <Button size="small" variant="outlined">
            Edit
          </Button>
          <Button size="small" variant="outlined" color="error">
            Delete
          </Button>
        </Box>
      )
    }
  ];

  const rows = filteredTasks.map(task => ({
    id: task.id,
    taskType: task.taskType,
    batch: task.batch,
    assignedUser: task.assignedUser,
    status: task.status,
    createdAt: task.createdAt,
    ...task
  }));

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AdminPanelSettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Welcome, {userName} (Administrator)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor all tasks across projects
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="table">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="cards">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <ButtonComponent
            buttonVariant="secondary"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </ButtonComponent>
          
          <ButtonComponent
            buttonVariant="secondary"
            startIcon={<FilterListIcon />}
          >
            Filters
          </ButtonComponent>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="Total Tasks"
            count={stats.totalTasks.toString()}
            color="#744DCD"
            icon={<AssignmentIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="Completed Tasks"
            count={stats.completedTasks.toString()}
            color="#059669"
            icon={<TrendingUpIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="In Progress"
            count={stats.inProgressTasks.toString()}
            color="#92400e"
            icon={<AssignmentIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="Active Annotators"
            count={stats.uniqueAnnotators.toString()}
            color="#0369a1"
            icon={<PeopleIcon />}
          />
        </Grid>
      </Grid>

      {/* Progress Overview */}
      <Box mb={3} p={2} bgcolor="grey.50" borderRadius={2}>
        <Typography variant="h6" mb={1}>
          Overall Progress: {completionRate}%
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label={`${stats.pendingTasks} Pending`} variant="outlined" />
          <Chip label={`${stats.inProgressTasks} In Progress`} variant="outlined" />
          <Chip label={`${stats.completedTasks} Completed`} variant="outlined" />
        </Box>
      </Box>

      {/* Search */}
      <Box mb={3}>
        <SearchInput
          placeholder="Search tasks by type, assignee, or project..."
          onSearch={setSearchQuery}
        />
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tasks Display - Table or Cards */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : viewMode === 'table' ? (
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
        />
      ) : (
        <Grid container spacing={2}>
          {filteredTasks.map(task => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <TaskCard 
                task={task}
                variant="admin"
                showActions={true}
                showProjectInfo={true}
                showAssigneeInfo={true}
                onViewTask={handleViewTask}
                elevation={1}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <Box textAlign="center" py={4}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'No tasks match your search' : 'No tasks found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try adjusting your search terms' : 'Tasks will appear here when created'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdminTasksView;