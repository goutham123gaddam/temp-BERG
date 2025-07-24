import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL;

import type { RootState } from '../../app/store';

// Get tasks by batch ID
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (batchId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;
    
    try {
      const response = await axios.get(`${VITE_API_URL}/api/v1/tasks?batchId=${batchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading tasks');
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/v1/tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating task');
    }
  }
);

// Update existing task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: any }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.put(
        `${VITE_API_URL}/api/v1/tasks/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating task');
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      await axios.delete(`${VITE_API_URL}/api/v1/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting task');
    }
  }
);

interface TaskState {
  items: any[];
  loading: boolean;
  error: string | null;
  isCreateLoading: boolean;
  isCreateError: string | null;
  isUpdateLoading: boolean;
  isUpdateError: string | null;
  isDeleteLoading: boolean;
  isDeleteError: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
  isCreateLoading: false,
  isCreateError: null,
  isUpdateLoading: false,
  isUpdateError: null,
  isDeleteLoading: false,
  isDeleteError: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.isCreateError = null;
      state.isUpdateError = null;
      state.isDeleteError = null;
    },
    clearTasks: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isCreateLoading = true;
        state.isCreateError = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isCreateLoading = false;
        state.items = [...state.items, action.payload];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isCreateLoading = false;
        state.isCreateError = action.payload as string;
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.isUpdateLoading = true;
        state.isUpdateError = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isUpdateLoading = false;
        state.isUpdateError = action.payload as string;
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isDeleteLoading = true;
        state.isDeleteError = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isDeleteLoading = false;
        state.items = state.items.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isDeleteLoading = false;
        state.isDeleteError = action.payload as string;
      });
  },
});

export const { clearErrors, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;