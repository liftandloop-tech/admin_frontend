import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import { baseApi } from './api/baseApi';

/**
 * Redux Store Configuration
 * 
 * Configures the Redux store with:
 * - Auth slice for authentication state
 * - RTK Query API for data fetching
 * - Redux DevTools support
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

