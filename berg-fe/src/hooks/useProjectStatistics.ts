import { useDispatch, useSelector } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState, AppDispatch } from '../app/store';
import { ROUTES_BACKEND as ROUTES } from '../constant';

const VITE_API_URL = import.meta.env.VITE_API_URL;

// Create a thunk for fetching statistics
export const getProjectStatistics = createAsyncThunk(
  'projectStats/getStatistics',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;
    
    try {
      const response = await axios.get(`${VITE_API_URL}${ROUTES.GET_PROJECT_STATISTICS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading statistics');
    }
  }
);

export const useProjectStatistics = () => {
  const dispatch = useDispatch<AppDispatch>();

  // You would need to add this to your Redux store, or just use it directly
  // For now, let's keep it simple and use the existing projects data
  const { projects } = useSelector((state: RootState) => state.projects);

  // Calculate statistics from projects data (same as before)
  const statistics = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.progress === 100).length,
    activeProjects: projects.filter(p => p.progress < 100).length,
    totalTasks: projects.reduce((sum, project) => sum + (project.totalTasks || 0), 0),
    completedTasks: projects.reduce((sum, project) => sum + (project.completedTasks || 0), 0),
    averageAccuracy: projects.length > 0 
      ? projects.reduce((sum, project) => sum + (project.accuracy || 0), 0) / projects.length
      : 0
  };

  return {
    statistics,
  };
};