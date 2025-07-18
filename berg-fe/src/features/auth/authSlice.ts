import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
import { ROUTES_BACKEND as ROUTES } from '../../constant';
export type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
    refresh_token: string;
    user: {
      id: string;
      aud: string;
      role: string;
      email: string;
      email_confirmed_at: string;
      phone: string;
      confirmed_at: string;
      last_sign_in_at: string;
      app_metadata: {
        provider: string;
        providers: string[];
      };
      user_metadata: {
        role: string;
      };
      identities: Array<{
        identity_id: string;
        id: string;
        user_id: string;
        identity_data: {
          email: string;
          email_verified: boolean;
          phone_verified: boolean;
          sub: string;
        };
        provider: string;
        last_sign_in_at: string;
        created_at: string;
        updated_at: string;
        email: string;
      }>;
      created_at: string;
      updated_at: string;
      is_anonymous: boolean;
    };
  };

  
const headers = {
    'Content-Type': 'application/json',
    'apiKey': API_KEY
}

export const login = createAsyncThunk('auth/login', async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}${ROUTES.LOGIN}`, credentials, { headers });
    console.log(response.data);
    return response.data;
});


export const signup = createAsyncThunk('auth/signup', async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}${ROUTES.SIGNUP}`, credentials, { headers });
    console.log(response.data);
    return response.data;
});

const initialStateType = {
    user: null as LoginResponse | null,
    loading: false,
    error: ''
}
const authSlice = createSlice({
    name: 'auth',
    initialState: initialStateType,
    reducers: {
        logout: (state: { user: null | unknown; loading: boolean; error: string }) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        clearError: (state: { user: null | unknown; loading: boolean; error: string }) => {
            state.error = '';
        },
        setAuth: (state, action: PayloadAction<LoginResponse>) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            });
            builder.addCase(signup.pending,(state)=>{
                state.loading = true;
            }).addCase(signup.fulfilled,(state,action)=>{
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            }).addCase(signup.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            });
    },
});

export const { logout, clearError, setAuth } = authSlice.actions;
export default authSlice.reducer;