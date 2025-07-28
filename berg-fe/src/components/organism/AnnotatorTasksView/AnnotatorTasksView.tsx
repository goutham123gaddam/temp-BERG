import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Avatar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import WorkIcon from '@mui/icons-material/Work';
import TimerIcon from '@mui/icons-material/Timer';

import { fetchMyTasks } from '../../../features/task/taskSlice';
import CountBox from '../../molecules/CountBox/CountBox';
import ButtonComponent from '../../atoms/Button/Button';
import SearchInput from '../../molecules/SearchInput/SearchInput';
import TaskCard from '../../molecules/TaskCard/TaskCard';
import type { RootState, AppDispatch } from '../../../app/store';

interface AnnotatorTasksViewProps {
  userName: string;
}

const AnnotatorTasksView: React.FC<AnnotatorTasksViewProps> = ({ userName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  /*
  useEffect(() => {
    // Fetch tasks assigned to current user
    dispatch(fetchMyTasks());
    
    // TEMPORARY: Use mock data for testing if no real tasks
    // TODO: Remove this when backend is fully connected
    if (tasks.length === 0) {
      import('../../utils/mockTaskData').then(({ mockAnnotatorTasks }) => {
        // Simulate Redux state update with mock data
        console.log(' Using mock data for testing - remove in production');
        setFilteredTasks(mockAnnotatorTasks);
      });
    }
  }, [dispatch]);
  */

  useEffect(() => {
    // Apply filtering
    let filtered = tasks;
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.taskType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.templateData?.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.batch?.project?.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, statusFilter, searchQuery]);

  const handleRefresh = () => {
    dispatch(fetchMyTasks());
  };

  const handleStartTask = (taskId: string) => {
    // TODO: Navigate to task execution interface (Task 6)
    console.log('Starting task:', taskId);
  };

  const handleContinueTask = (taskId: string) => {
    // TODO: Navigate to task execution interface (Task 6)
    console.log('Continuing task:', taskId);
  };

  // Calculate enhanced statistics
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    inProgressTasks: tasks.filter(task => task.status === 'in_progress').length,
    pendingTasks: tasks.filter(task => task.status === 'pending').length,
    todaysTasks: tasks.filter(task => {
      const today = new Date().toDateString();
      return new Date(task.createdAt).toDateString() === today;
    }).length,
    averageAccuracy: tasks.length > 0 ? 
      Math.round(tasks.reduce((acc, task) => acc + (task.accuracy || 0), 0) / tasks.length) : 0,
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <Box>
      {/* Enhanced Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          <PersonIcon />
        </Avatar>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Welcome, {userName} (Annotator)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You have {stats.pendingTasks + stats.inProgressTasks} active tasks • {completionRate}% completion rate
          </Typography>
        </Box>
        <ButtonComponent
          buttonVariant="secondary"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </ButtonComponent>
      </Box>

      {/* Enhanced Progress Statistics */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="Tasks Completed"
            count={`${stats.completedTasks}/${stats.totalTasks}`}
            color="#059669"
            icon={<CheckCircleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="In Progress"
            count={stats.inProgressTasks.toString()}
            color="#92400e"
            icon={<WorkIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="Pending"
            count={stats.pendingTasks.toString()}
            color="#b91c1c"
            icon={<PendingIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CountBox
            label="Today's Tasks"
            count={stats.todaysTasks.toString()}
            color="#0369a1"
            icon={<TimerIcon />}
          />
        </Grid>
      </Grid>

      {/* Overall Progress Bar */}
      <Box mb={3} p={3} bgcolor="primary.50" borderRadius={2} border={1} borderColor="primary.200">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Overall Progress
          </Typography>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {completionRate}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={completionRate} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5
            }
          }} 
        />
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="text.secondary">
            {stats.completedTasks} completed of {stats.totalTasks} total tasks
          </Typography>
          {stats.averageAccuracy > 0 && (
            <Typography variant="body2" color="success.main">
              Avg. Accuracy: {stats.averageAccuracy}%
            </Typography>
          )}
        </Box>
      </Box>

      {/* Enhanced Active Work Queue Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Active Work Queue
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} 
            {statusFilter !== 'all' && ` • ${statusFilter.replace('_', ' ')} only`}
            {searchQuery && ` • Filtered by "${searchQuery}"`}
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <SearchInput
            placeholder="Search tasks or products..."
            onSearch={setSearchQuery}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Task Cards using new TaskCard component */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              variant="compact"
              showActions={true}
              showProjectInfo={true}
              onStartTask={handleStartTask}
              onContinueTask={handleContinueTask}
              elevation={2}
            />
          ))}
        </Box>
      )}

      {/* Enhanced Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <Box textAlign="center" py={6}>
          <AssignmentIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" mb={1}>
            {searchQuery ? 'No matching tasks found' :
             statusFilter !== 'all' ? `No ${statusFilter.replace('_', ' ')} tasks` :
             'No tasks assigned yet'}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {searchQuery ? 'Try adjusting your search terms or clearing filters' :
             statusFilter !== 'all' ? 'Try changing the filter to see other tasks' :
             'New tasks will appear here when assigned to you by administrators'}
          </Typography>
          
          <Box display="flex" gap={2} justifyContent="center">
            {(searchQuery || statusFilter !== 'all') && (
              <ButtonComponent
                buttonVariant="secondary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </ButtonComponent>
            )}
            <ButtonComponent
              buttonVariant="primary"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
            >
              Refresh Tasks
            </ButtonComponent>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AnnotatorTasksView;