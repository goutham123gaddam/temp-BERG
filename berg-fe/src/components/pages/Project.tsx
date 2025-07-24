import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PercentIcon from '@mui/icons-material/Percent';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataTable from '../organism/DataTable/DataTable';
import ButtonComponent from '../atoms/Button/Button';
import CountBox from '../molecules/CountBox/CountBox';
import SearchInput from '../molecules/SearchInput/SearchInput';
import ExternalFilter from '../organism/ExternalFilter/ExternalFilter';
import StatusChip from '../atoms/StatusChip/StatusChip';
import ProgressCircle from '../molecules/ProgressCircle/ProgressCircle';
import DrawerFrom from '../organism/DrawerFrom/DrawerFrom';
import { useProjects } from '../../hooks/useProjects';
import { useDynamicFilters } from '../../hooks/useDynamicFilters';
import { useSnackbar } from '../../hooks/useSnackbar';
import { PROJECT_FILTER_DATE } from '../../constant';
import { ROUTES_FRONTEND as ROUTES } from '../../constant';

export default function Project() {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateFilterLabel, setDateFilterLabel] = React.useState('Today');
  const [selectedFilters, setSelectedFilters] = React.useState<{
    status: string[];
    projectName: string[];
    owner: string[];
    progress: string[];
    priority: string[];
    date: string;
  }>({
    status: [],
    projectName: [],
    owner: [],
    progress: [],
    priority: [],
    date: ''
  });

  const { projects, loading, error, projectStats, handleDeleteProject, isDeleteLoading } = useProjects();
  const { 
    projectFilterOptions, 
    dateFilterOptions, 
    applyFilters, 
    getFilterSummary 
  } = useDynamicFilters(projects || []);
  const { success, error: showError } = useSnackbar();
  const navigate = useNavigate();

  // Apply filters to projects
  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    return applyFilters(projects, searchQuery, selectedFilters);
  }, [projects, searchQuery, selectedFilters, applyFilters]);

  // Get active filter summary
  const activeFilterSummary = React.useMemo(() => {
    return getFilterSummary(selectedFilters);
  }, [selectedFilters, getFilterSummary]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMainFilterApply = (
    selectedValues: Record<string, string>,
    selectedCheckboxes: Record<string, string[]>
  ) => {
    setSelectedFilters(prev => ({
      ...prev,
      status: selectedCheckboxes['STATUS'] || [],
      projectName: selectedCheckboxes['PROJECT NAME'] || [],
      owner: selectedCheckboxes['OWNER'] || [],
      progress: selectedCheckboxes['PROGRESS'] || [],
      priority: selectedCheckboxes['PRIORITY'] || []
    }));
  };

  const handleDateFilterApply = (selectedValues: Record<string, string>) => {
    if (selectedValues['DATE']) {
      setDateFilterLabel(selectedValues['DATE']);
    } else {
      setDateFilterLabel('Filtered');
    }

    setSelectedFilters(prev => ({
      ...prev,
      date: selectedValues['DATE'] || ''
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      status: [],
      projectName: [],
      owner: [],
      progress: [],
      priority: [],
      date: ''
    });
    setSearchQuery('');
    setDateFilterLabel('Today');
  };

  const clearSpecificFilter = (filterType: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType as keyof typeof prev]) ? [] : ''
    }));
  };

  const handleView = (projectId: string) => {
    navigate(ROUTES.BATCH.replace(':projectId', projectId));
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    const result = await handleDeleteProject(projectToDelete);
    
    if (result.success) {
      success('Project deleted successfully!');
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } else {
      showError('Failed to delete project. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // Calculate ETA for each project
  const calculateETA = (project: any) => {
    const progress = project.progress || 0;
    const totalTasks = project.totalTasks || 0;
    const completedTasks = project.completedTasks || 0;
    
    if (progress === 100) return "Completed";
    if (totalTasks > 0 && completedTasks > 0) {
      const remainingTasks = totalTasks - completedTasks;
      const avgTasksPerDay = 5;
      const daysRemaining = Math.ceil(remainingTasks / avgTasksPerDay);
      return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
    }
    return "Unknown";
  };

  // Transform data for table display
  const rows = React.useMemo(() => {
    return (filteredProjects || []).map((project) => {
      const progress = project.progress || 0;
      const accuracy = project.accuracy || 0;
      const totalTasks = project.totalTasks || 0;
      const completedTasks = project.completedTasks || 0;
      const status = progress === 100 ? 'Completed' : 'Active';
      const eta = calculateETA(project);
      
      return {
        name: project.projectName,
        client: project.owner || 'Unassigned',
        progress: progress,
        Accuracy: `${accuracy}%`,
        Eta: eta,
        Status: status,
        totalTasks: totalTasks,
        completedTasks: completedTasks,
        btn: project.id,
        Manage: 'Manage',
      };
    });
  }, [filteredProjects]);

  const columns = [
    {
      title: () => <Box>Project Name</Box>,
      field: 'name',
      render: (rowData: any, row: any) => (
        <Box width="100%">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ color: '#744DCD', bgcolor: '#E8DEFD' }}>
              {rowData?.charAt(0)?.toUpperCase() || 'P'}
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
      title: 'Client',
      field: 'client',
      render: (rowData: string) => (
        <Typography>{rowData}</Typography>
      )
    },
    {
      title: 'Progress',
      field: 'progress',
      render: (rowData: number, row: any) => (
        <Box display="flex" alignItems="center" gap={1}>
          <ProgressCircle value={rowData || 0} size={30} />
        </Box>
      )
    },
    {
      title: 'Accuracy',
      field: 'Accuracy',
      render: (rowData: string) => (
        <Typography color={parseFloat(rowData) > 80 ? 'success.main' : 'warning.main'}>
          {rowData}
        </Typography>
      )
    },
    {
      title: 'ETA',
      field: 'Eta',
      render: (rowData: string) => (
        <Typography variant="body2">{rowData}</Typography>
      )
    },
    {
      title: 'Status',
      field: 'Status',
      render: (rowData: string) => (
        <StatusChip 
          status={rowData} 
          variant={rowData === 'Completed' ? 'success' : 'warning'} 
        />
      )
    },
    {
      title: 'Actions',
      field: 'btn',
      render: (rowData: string) => (
        <Box display="flex" gap={1}>
          <ButtonComponent 
            buttonVariant="secondary" 
            sx={{ p: 1, minWidth: 'auto' }}
            onClick={() => handleView(rowData)}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </ButtonComponent>
          <ButtonComponent 
            buttonVariant="secondary" 
            sx={{ p: 1, minWidth: 'auto' }}
            onClick={() => handleDeleteClick(rowData)}
            disabled={isDeleteLoading}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </ButtonComponent>
          <ButtonComponent 
            buttonVariant="secondary" 
            sx={{ p: 1, minWidth: 'auto' }}
          >
            <SettingsOutlinedIcon fontSize="small" />
          </ButtonComponent>
        </Box>
      )
    }
  ];

  return (
    <>
      <Box>
        {/* Header Section */}
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

        {/* Stats Section */}
        <Box flex={1} display="flex" gap={4} py={2}>
          <CountBox 
            label="Total No of projects" 
            count={projectStats?.totalProjects?.toString() || "0"} 
            color="#744DCD" 
            icon={<MenuBookOutlinedIcon />} 
          />
          <CountBox 
            label="Total task done" 
            count={projectStats ? `${projectStats.completedTasks}/${projectStats.totalTasks}` : "0/0"} 
            color="#744DCD" 
            icon={<AssignmentReturnedIcon />} 
          />
          <CountBox 
            label="Average Accuracy" 
            count={projectStats ? `${projectStats.averageAccuracy}%` : "0%"} 
            color="#744DCD" 
            icon={<PercentIcon />} 
          />
        </Box>

        {/* Search and Filter Section */}
        <Box px={2} py={2} display="flex" alignItems="center" gap={2} borderBottom="1px solid #F0F2F5">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search by project name, status, client name"
            sx={{ background: '#F7F9FC', flex: 1 }}
          />

          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <ExternalFilter
              icon={<FilterAltOutlinedIcon />}
              triggerLabel="Filter"
              applyButtonLabel="Apply Filter"
              groupedOptions={projectFilterOptions}
              onApplyFilter={handleMainFilterApply}
            />

            <ExternalFilter
              icon={<CalendarMonthOutlinedIcon />}
              triggerLabel={dateFilterLabel}
              applyButtonLabel="Apply Filter"
              groupedOptions={PROJECT_FILTER_DATE}
              onApplyFilter={handleDateFilterApply}
            />

            {activeFilterSummary.length > 0 && (
              <ButtonComponent 
                buttonVariant="secondary" 
                onClick={clearAllFilters}
                sx={{ p: 1 }}
              >
                <ClearIcon fontSize="small" />
                Clear All
              </ButtonComponent>
            )}
          </Box>
        </Box>

        {/* Active Filters Display */}
        {activeFilterSummary.length > 0 && (
          <Box px={2} py={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">Active filters:</Typography>
            {activeFilterSummary.map((filter, index) => (
              <Chip
                key={index}
                label={filter}
                size="small"
                onDelete={() => {
                  const filterType = filter.split(':')[0].toLowerCase().replace(' ', '');
                  clearSpecificFilter(filterType);
                }}
                deleteIcon={<ClearIcon />}
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Results Info */}
        <Box px={2} py={1}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredProjects?.length || 0} of {projects?.length || 0} projects
            {searchQuery && ` matching "${searchQuery}"`}
            {activeFilterSummary.length > 0 && ` with ${activeFilterSummary.length} filter(s) applied`}
          </Typography>
        </Box>

        {/* Data Table with Loading and Error States */}
        <Box>
          {loading ? (
            <Box p={3} display="flex" alignItems="center" gap={1}>
              <CircularProgress size={20} />
              Loading...
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ p: 2 }}>
              Failed to load projects.
            </Alert>
          ) : (
            <DataTable columns={columns} rows={rows} />
          )}
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this project? This action cannot be undone.
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
    </>
  );
}