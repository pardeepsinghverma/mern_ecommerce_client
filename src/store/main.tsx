import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>; // Gives access to the entire state shape
export type AppDispatch = typeof store.dispatch; // Correctly types dispatch to handle async thunks
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Export the store as default
export default store;
