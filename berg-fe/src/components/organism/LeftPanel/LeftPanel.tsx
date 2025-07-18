import React, { useEffect, useState } from 'react';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Box from '@mui/material/Box';
import SearchInput from '../../molecules/SearchInput/SearchInput';
import { Typography } from '@mui/material';
import ProjectSideIcon from '../../../assets/layout/project-side-icon.svg';
import DashboardIcon from '../../../assets/layout/home-side-icon.svg';
import { ROUTES_FRONTEND } from '../../../constant/route';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfile from '../../molecules/Userprofile/UserProfile';

const options = [
  {
    label: 'Dashboard',
    icon: <img src={DashboardIcon} alt="DashboardIcon" />,
    roleAccess: ['admin', 'user'],
    link: ROUTES_FRONTEND.DASHBOARD,
  },
  {
    label: 'Projects',
    icon: <img src={ProjectSideIcon} alt="ProjectSideIcon" />,
    roleAccess: ['admin', 'user'],
    link: ROUTES_FRONTEND.PROJECTS,
  },
];

export default function LeftPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = 'admin'; // Replace with actual logic from context/store/auth

  const [active, setActive] = useState(location.pathname);
  const [tabs, setTabs] = useState(() =>
    options.filter((item) => item.roleAccess.includes(userRole))
  );

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

  // Fetch user data from localStorage
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const role = userData?.user?.email;
  const name = userData?.user?.user_metadata?.name || role?.split('@')[0];

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
          name={name}
          role={role}
          avatarUrl="https://via.placeholder.com/150"
        />
      </Box>
    </Box>
  );
}
