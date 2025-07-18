import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';
import { ROUTES_BACKEND as ROUTES } from '../../constant';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const getBatchesByProjectId = createAsyncThunk(
  'batch/getBatchesByProjectId',
  async (projectId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.get(
        `${VITE_API_URL}${ROUTES.GET_BATCHS_ID}${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading batches');
    }
  }
);

interface BatchState {
  batches: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BatchState = {
  batches: [],
  loading: false,
  error: null,
};

const batchSlice = createSlice({
  name: 'batch',
  initialState,
  reducers: {
    clearBatches: (state) => {
      state.batches = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBatchesByProjectId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBatchesByProjectId.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.batches = action.payload;
        } else if (action.payload) {
          state.batches = [action.payload];
        }
      })
      .addCase(getBatchesByProjectId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBatches } = batchSlice.actions;
export default batchSlice.reducer;
