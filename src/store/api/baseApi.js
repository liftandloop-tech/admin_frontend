import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../../features/auth/authSlice';

/**
 * Base RTK Query API Configuration
 * 
 * Provides base configuration for all API endpoints including:
 * - Base URL
 * - Token injection via headers
 * - Error handling
 * - Cache configuration
 */

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = getState().auth?.token;
    
    // Add token to headers if available
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Set content type
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

/**
 * Enhanced baseQuery with automatic logout on 401 Unauthorized
 * and proper error handling for all error responses
 * 
 * Intercepts responses and:
 * - Handles 401: Logs out user and redirects to login
 * - Handles 500: Provides better error messages
 * - Transforms error responses to consistent format
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Get the URL from args to check if it's a login endpoint
  const url = typeof args === 'string' ? args : args?.url || '';
  const isLoginEndpoint = url.includes('/auth/login');
  
  // Handle 401 Unauthorized - logout and redirect
  // BUT: Don't redirect on login endpoints - let the error be displayed to the user
  if (result.error && result.error.status === 401 && !isLoginEndpoint) {
    // Dispatch logout action to clear auth state
    api.dispatch(logout());
    
    // Redirect to login page
    // Use window.location to ensure a full page reload and clear any cached state
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    return result;
  }
  
  // Handle other errors (400, 500, etc.) - transform to consistent format
  if (result.error) {
    const { status, data } = result.error;
    
    // Transform error response to include backend error message if available
    result.error = {
      ...result.error,
      // Extract error message from backend response
      message: data?.message || data?.error || `Request failed with status ${status}`,
      // Include full error data for debugging
      data: data,
      // Status code
      status: status,
    };
    
    // Log server errors (500, 502, 503, etc.) for debugging
    if (status >= 500) {
      console.error('Server Error:', {
        url: args?.url || args,
        status,
        error: data?.message || data?.error || 'Internal server error',
        fullError: data,
      });
    }
  }
  
  return result;
};

/**
 * Base API slice with RTK Query
 * 
 * All API endpoints are injected into this base API.
 * Endpoints are automatically registered when imported in components.
 * 
 * Configuration:
 * - keepUnusedDataFor: Keep cached data for 60 seconds after last use
 * - refetchOnMountOrArgChange: Don't refetch on mount if cached data exists (reduces redundant requests)
 * - refetchOnFocus: Disabled to prevent refetching when switching browser tabs (reduces server load)
 * - refetchOnReconnect: Enabled to refetch when network reconnects (useful for network issues)
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Salon',
    'Reseller',
    'License',
    'Dashboard',
    'BusinessCategory',
    'Subscription',
    'Activity',
  ],
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds (default)
  refetchOnMountOrArgChange: false, // Don't refetch on mount if cached data exists
  refetchOnFocus: false, // Disable refetch on window focus (prevents repetitive requests on tab switch)
  refetchOnReconnect: true, // Keep refetch on reconnect (useful for network issues)
  endpoints: () => ({}),
});

