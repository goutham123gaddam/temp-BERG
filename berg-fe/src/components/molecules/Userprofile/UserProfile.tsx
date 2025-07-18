// src/components/molecules/UserInfo.tsx

import React from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {useAuth} from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import { ROUTES_FRONTEND as ROUTES } from '../../../constant';

interface UserInfoProps {
  name: string;
  role: string;
  avatarUrl: string;

}

const UserProfile: React.FC<UserInfoProps> = ({ name, role, avatarUrl }) => {
 
  const { logoutUser} = useAuth();
  const navigate = useNavigate();
   const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN); 
  };
  return (
    <Box display="flex" alignItems="center" ml={2}>
      <Avatar src={avatarUrl} />
      <Box ml={1}>
        <Typography fontWeight="bold">{name}</Typography>
        <Typography variant="body2" color="textSecondary">{role}</Typography>
      </Box>
      <Tooltip title="Logout">
        <IconButton onClick={handleLogout} sx={{ ml: 1 }}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UserProfile;
