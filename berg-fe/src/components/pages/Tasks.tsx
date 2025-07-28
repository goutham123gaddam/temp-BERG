import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getCurrentUserRole, getCurrentUserName, debugUserRole } from '../../utils/roleUtils';
import AdminTasksView from '../organism/AdminTasksView/AdminTasksView';
import AnnotatorTasksView from '../organism/AnnotatorTasksView/AnnotatorTasksView';

export default function Tasks() {
  const { user, validateToken } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate authentication and determine user role
    const currentUser = validateToken();
    
    if (currentUser) {
      // Use utility functions for consistent role detection
      const role = getCurrentUserRole();
      const name = getCurrentUserName();
      
      // Debug logging to help troubleshoot
      debugUserRole();
      
      setUserRole(role);
      setUserName(name);
    }
    
    setLoading(false);
  }, [user, validateToken]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Alert severity="error">
          Authentication required. Please log in to view tasks.
        </Alert>
      </Box>
    );
  }

  // Role-based view rendering
  const renderTaskView = () => {
    switch (userRole) {
      case 'admin':
        return <AdminTasksView userName={userName} />;
      case 'annotator':
        return <AnnotatorTasksView userName={userName} />;
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Tasks
            </Typography>
            <Alert severity="info">
              Welcome {userName}! Your role-specific task view is being prepared.
            </Alert>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {renderTaskView()}
    </Box>
  );
}