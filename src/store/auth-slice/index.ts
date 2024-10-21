import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null, // New field for error handling
};

// Async thunk for registering the user
export const registerUser = createAsyncThunk(
  'auth/register', // Updated action name
  async (formData: any, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      // Handle error and return custom error message
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Something went wrong during registration'
      );
    }
  }
);

// Slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const { setUserInfo } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
