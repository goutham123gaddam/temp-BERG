import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';

const VITE_API_URL = import.meta.env.VITE_API_URL;

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
  isStatusUpdateLoading: boolean;
  isStatusUpdateError: string | null;
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
  isStatusUpdateLoading: false,
  isStatusUpdateError: null,
};

// Async thunks
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
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.post(`${VITE_API_URL}/api/v1/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: any }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.put(`${VITE_API_URL}/api/v1/tasks/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

// New action specifically for status updates
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }: { id: string; status: string }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.patch(`${VITE_API_URL}/api/v1/tasks/${id}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      await axios.delete(`${VITE_API_URL}/api/v1/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.isCreateError = null;
      state.isUpdateError = null;
      state.isDeleteError = null;
      state.isStatusUpdateError = null;
    },
    clearTasks: (state) => {
      state.items = [];
    },
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
      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.isStatusUpdateLoading = true;
        state.isStatusUpdateError = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isStatusUpdateLoading = false;
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.isStatusUpdateLoading = false;
        state.isStatusUpdateError = action.payload as string;
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