import React from 'react'
import { useProjects } from '../../hooks/useProjects';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import CountBox from '../molecules/CountBox/CountBox';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import PercentIcon from '@mui/icons-material/Percent';
export default function Dashboard() {
    const { projects, loading, error, projectStats, handleDeleteProject, isDeleteLoading } = useProjects();
  return (
    <div>   
      <Box>
       <Box flex={1} display="flex" gap={1} py={2}>
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
              </Box>
        <Box flex={1} display="flex" gap={1} py={2}>
        <CountBox label="Total No of Team members" count="100" color="#744DCD" icon={<GroupsOutlinedIcon />} />
        <CountBox label="Total active teams" count="40" color="#744DCD" icon={<ControlPointIcon />} />
        <CountBox label="Total suspended teams" count="30%" color="#981B1B" icon={<ReportProblemIcon />} />
      </Box>
        </div>
  )
}
