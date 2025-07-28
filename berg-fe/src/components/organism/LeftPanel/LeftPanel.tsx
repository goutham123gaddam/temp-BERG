import React, { useEffect, useState } from 'react';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Box from '@mui/material/Box';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchInput from '../../molecules/SearchInput/SearchInput';
import { Typography } from '@mui/material';
import ProjectSideIcon from '../../../assets/layout/project-side-icon.svg';
import DashboardIcon from '../../../assets/layout/home-side-icon.svg';
import { ROUTES_FRONTEND } from '../../../constant/route';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfile from '../../molecules/Userprofile/UserProfile';
import { getCurrentUserRole, getCurrentUserName } from '../../../utils/roleUtils';

const options = [
  {
    label: 'Dashboard',
    icon: <img src={DashboardIcon} alt="DashboardIcon" />,
    roleAccess: ['admin', 'user', 'annotator'],
    link: ROUTES_FRONTEND.DASHBOARD,
  },
  {
    label: 'Projects',
    icon: <img src={ProjectSideIcon} alt="ProjectSideIcon" />,
    roleAccess: ['admin', 'user'],
    link: ROUTES_FRONTEND.PROJECTS,
  },
  {
    label: 'Tasks',
    icon: <AssignmentIcon />,
    roleAccess: ['admin', 'user', 'annotator'],
    link: ROUTES_FRONTEND.TASKS,
  },
   {
    label: 'Team',
    icon: <GroupsOutlinedIcon />,
    roleAccess: ['admin', 'user'],
    link: ROUTES_FRONTEND.TEAM,
  },
];

export default function LeftPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState(location.pathname);
  const [tabs, setTabs] = useState<typeof options>([]);

  // Get user role using utility function
  const userRole = getCurrentUserRole();
  const userName = getCurrentUserName();
  
  // Get email for UserProfile (legacy support)
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userEmail = userData?.user?.email || '';

  useEffect(() => {
    // Filter options based on user role
    const filteredOptions = options.filter((item) => item.roleAccess.includes(userRole));
    setTabs(filteredOptions);
  }, [userRole]);

  const handleSearch = (value: string) => {
    const filtered = options
      .filter((item) => item.roleAccess.includes(userRole))
      .filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      );
    setTabs(filtered);
  };

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      p={2}
      sx={{ minHeight: '100vh' }}
    >
      <RssFeedIcon sx={{ fontSize: 28 }} />
      <SearchInput onSearch={handleSearch} />

      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          color: '#667185',
          padding: 0,
          margin: 0,
          listStyle: 'none',
        }}
      >
        {tabs.map((item) => (
          <li
            key={item.label}
            onClick={() => {
              navigate(item.link);
              setActive(item.link);
            }}
            style={{
              cursor: 'pointer',
              color: active === item.link ? '#000' : '#667185',
              fontWeight: active === item.link ? 'bold' : 'normal',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <span>{item.icon}</span>
              <Typography>{item.label}</Typography>
            </Box>
          </li>
        ))}
      </ul>
      <Box sx={{ mt: 'auto' ,pb:8}}>
        <UserProfile
          name={userName}
          role={userEmail}
          avatarUrl="https://via.placeholder.com/150"
        />
      </Box>
    </Box>
  );
}