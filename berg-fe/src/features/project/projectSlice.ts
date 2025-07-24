import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;

import { ROUTES_BACKEND as ROUTES } from '../../constant';
import type { RootState } from '../../app/store';

export const getProjects = createAsyncThunk(
  'project/getProjects',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;
    try {
      const response = await axios.get(`${VITE_API_URL}${ROUTES.GET_PROJECTS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading projects');
    }
  }
);

export const createProjects = createAsyncThunk(
  'project/createProjects',
  async (projectData: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.post(
        `${VITE_API_URL}${ROUTES.POST_PROJECTS}`, // Fixed: Use correct endpoint
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      await axios.delete(`${VITE_API_URL}${ROUTES.GET_PROJECTS}/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return projectId; // Return the deleted project ID
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting project');
    }
  }
);

export const addBatch = createAsyncThunk(
  'batch/addBatch',
  async (
    payload: { projectId: string; batchName: string; dueDate: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.post(
        `${VITE_API_URL}${ROUTES.ADD_BATCH}`, // ADD_BATCH: '/api/v1/batches'
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error adding batch');
    }
  }
);

interface ProjectState {
  projects: any[];
  loading: boolean;
  error: string | null;
  isCreateLoading: boolean;
  isCreateError: string | null;
  createdProject: any | null;
  isDeleteLoading: boolean;
  isDeleteError: string | null;
  isAddBatchLoading: boolean;
  isAddBatchError: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  isCreateLoading: false,
  isCreateError: null,
  createdProject: null,
  isDeleteLoading: false,
  isDeleteError: null,
  isAddBatchLoading: false,
  isAddBatchError: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.isCreateError = null;
      state.isDeleteError = null;
      state.isAddBatchError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Projects
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Projects
      .addCase(createProjects.pending, (state) => {
        state.isCreateLoading = true;
        state.isCreateError = null;
      })
      .addCase(createProjects.fulfilled, (state, action) => {
        state.isCreateLoading = false;
        if (Array.isArray(action.payload)) {
          state.projects = action.payload;
        } else if (action.payload) {
          state.projects = [...state.projects, action.payload];
        }
      })
      .addCase(createProjects.rejected, (state, action) => {
        state.isCreateLoading = false;
        state.isCreateError = action.payload as string;
      })
      // Delete Projects
      .addCase(deleteProject.pending, (state) => {
        state.isDeleteLoading = true;
        state.isDeleteError = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isDeleteLoading = false;
        state.projects = state.projects.filter(
          project => project.id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isDeleteLoading = false;
        state.isDeleteError = action.payload as string;
      })
      // Add Batch
      .addCase(addBatch.pending, (state) => {
        state.isAddBatchLoading = true;
        state.isAddBatchError = null;
      })
      .addCase(addBatch.fulfilled, (state, action) => {
        state.isAddBatchLoading = false;
        // Optionally update the project with the new batch
        // You might want to refresh projects or update specific project
      })
      .addCase(addBatch.rejected, (state, action) => {
        state.isAddBatchLoading = false;
        state.isAddBatchError = action.payload as string;
      });
  },
});

export const { clearErrors } = projectSlice.actions;
export default projectSlice.reducer;