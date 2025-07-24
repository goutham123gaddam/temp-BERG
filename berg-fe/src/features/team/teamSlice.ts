import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';

const VITE_API_URL = import.meta.env.VITE_API_URL;

// Thunk to fetch teams
export const getTeams = createAsyncThunk(
  'team/getTeams',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.access_token;

    try {
      const response = await axios.get(`${VITE_API_URL}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching teams');
    }
  }
);

// State type
interface TeamState {
  teams: any[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
};

// Slice
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teamSlice.reducer;
