import { Outlet } from 'react-router-dom'
import LeftPanel from '../organism/LeftPanel/LeftPanel'
import Header from '../organism/Header/Header'
import Breadcrumbs from '@mui/material/Breadcrumbs';

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link as RouterLink
} from 'react-router-dom';
import { Breadcrumbs as MUIBreadcrumbs, Typography, Link, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Utility to capitalize and format URL segments
const formatSegment = (segment: string) =>
  segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

export default function Layout() {
    const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);
  return (
    
    <Box minHeight="100vh" display="flex" bgcolor="#F7F7F7" p={3} gap={2}>
      <Box flex={1}>
        <LeftPanel />
      </Box>
      <Box flex={4}>
        <Box minHeight={'100vh'} sx={{ background: '#FFFFFF', borderRadius: '20px' }} display={'flex'} flexDirection={'column'} gap={3}>
          <Header onSearch={() => { }} onMenuClick={() => { }} />
          <Box px={4}>

   <MUIBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = '/' + pathnames.slice(0, index + 1).join('/');
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {formatSegment(value)}
          </Typography>
        ) : (
          <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
            {formatSegment(value)}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
            
            </Box>
          <Box px={4}>
            <Outlet />
          </Box>

        </Box>
      </Box>
    </Box>
  )
}