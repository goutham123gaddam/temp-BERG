// src/store/project/projectSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// const API_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
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
        `${VITE_API_URL}${ROUTES.GET_BATCHS_ID}`,
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

interface ProjectState {
  projects: any[];
  loading: boolean;
  error: string | null;
  isCreateLoading: boolean;
  isCreateError: string | null;
  createdProject: any | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  isCreateLoading: false,
  isCreateError: null,
  createdProject: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      }).addCase(createProjects.pending, (state) => {
        state.isCreateLoading = true;
        state.isCreateError = null;
      })
      .addCase(createProjects.fulfilled, (state, action) => {
        state.isCreateLoading = false;
        // Fix: Always keep projects as an array
        if (Array.isArray(action.payload)) {
          state.projects = action.payload;
        } else if (action.payload) {
          state.projects = [...state.projects, action.payload];
        }
      })
      .addCase(createProjects.rejected, (state, action) => {
        state.isCreateLoading = false;
        state.isCreateError = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
