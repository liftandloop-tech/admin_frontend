import { createSlice } from '@reduxjs/toolkit';
import { getDefaultPermissions, PERMISSIONS } from '../../utils/permissions';

/**
 * Auth Slice
 * 
 * Manages authentication state including:
 * - User information
 * - Role and permissions
 * - Authentication tokens
 * - Authentication status
 */

const initialState = {
  user: null,
  role: null,
  permissions: {},
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Load initial state from localStorage if available
const loadAuthFromStorage = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      
      // Migrate permissions: Add LICENSE_VIEW and LICENSE_GENERATE for resellers if missing
      // This handles cases where resellers logged in before these permissions were added
      let permissions = parsed.permissions || {};
      if (parsed.role === 'reseller') {
        let needsUpdate = false;
        if (permissions['license:view'] === undefined) {
          permissions['license:view'] = true;
          needsUpdate = true;
        }
        if (permissions['license:generate'] === undefined) {
          permissions['license:generate'] = true;
          needsUpdate = true;
        }
        // Update localStorage with migrated permissions
        if (needsUpdate) {
          try {
            localStorage.setItem(
              'auth',
              JSON.stringify({
                ...parsed,
                permissions,
              })
            );
          } catch (error) {
            console.error('Failed to update permissions in storage:', error);
          }
        }
      }
      
      return {
        ...initialState,
        user: parsed.user || null,
        role: parsed.role || null,
        permissions: permissions,
        token: parsed.token || null,
        refreshToken: parsed.refreshToken || null,
        isAuthenticated: !!parsed.token,
      };
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromStorage(),
  reducers: {
    /**
     * Set user credentials after successful login
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload: { user, role, permissions, token, refreshToken }
     */
    setCredentials: (state, action) => {
      const { user, role, permissions, token, refreshToken } = action.payload;
      
      // Ensure resellers have LICENSE_GENERATE permission
      let finalPermissions = permissions || {};
      if (role === 'reseller') {
        const defaultResellerPermissions = getDefaultPermissions('reseller');
        
        // Merge with defaults to ensure all permissions are set
        finalPermissions = {
          ...defaultResellerPermissions,
          ...finalPermissions,
          // Explicitly ensure LICENSE_GENERATE is true for resellers
          [PERMISSIONS.LICENSE_GENERATE]: true,
          [PERMISSIONS.LICENSE_VIEW]: true,
        };
      }
      
      state.user = user;
      state.role = role;
      state.permissions = finalPermissions;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      try {
        localStorage.setItem(
          'auth',
          JSON.stringify({
            user,
            role,
            permissions: finalPermissions,
            token,
            refreshToken,
          })
        );
      } catch (error) {
        console.error('Failed to save auth to storage:', error);
      }
    },

    /**
     * Update user information
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload: user object
     */
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Update in localStorage
      try {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          localStorage.setItem(
            'auth',
            JSON.stringify({
              ...parsed,
              user: { ...parsed.user, ...action.payload },
            })
          );
        }
      } catch (error) {
        console.error('Failed to update user in storage:', error);
      }
    },

    /**
     * Update permissions
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload: permissions object
     */
    updatePermissions: (state, action) => {
      state.permissions = { ...state.permissions, ...action.payload };
      
      // Update in localStorage
      try {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          localStorage.setItem(
            'auth',
            JSON.stringify({
              ...parsed,
              permissions: { ...parsed.permissions, ...action.payload },
            })
          );
        }
      } catch (error) {
        console.error('Failed to update permissions in storage:', error);
      }
    },

    /**
     * Update access token (used during token refresh)
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload: { token }
     */
    updateToken: (state, action) => {
      state.token = action.payload.token;
      
      // Update in localStorage
      try {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          localStorage.setItem(
            'auth',
            JSON.stringify({
              ...parsed,
              token: action.payload.token,
            })
          );
        }
      } catch (error) {
        console.error('Failed to update token in storage:', error);
      }
    },

    /**
     * Set loading state
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload: boolean
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Set error message
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload: error string or null
     */
    setError: (state, action) => {
      state.error = action.payload;
    },

    /**
     * Clear authentication state (logout)
     * @param {Object} state - Current state
     */
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.permissions = {};
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Remove from localStorage
      try {
        localStorage.removeItem('auth');
      } catch (error) {
        console.error('Failed to remove auth from storage:', error);
      }
    },
  },
});

export const {
  setCredentials,
  updateUser,
  updatePermissions,
  updateToken,
  setLoading,
  setError,
  logout,
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.role;
export const selectPermissions = (state) => state.auth.permissions;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

/**
 * Check if user has a specific permission
 * @param {Object} state - Redux state
 * @param {string} permission - Permission string to check
 * @returns {boolean} - True if user has permission
 */
export const selectHasPermission = (state, permission) => {
  const permissions = state.auth.permissions;
  if (!permissions || !permission) return false;
  return permissions[permission] === true;
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} state - Redux state
 * @param {string[]} requiredPermissions - Array of permission strings
 * @returns {boolean} - True if user has at least one permission
 */
export const selectHasAnyPermission = (state, requiredPermissions) => {
  const permissions = state.auth.permissions;
  if (!permissions || !Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
    return false;
  }
  return requiredPermissions.some(permission => permissions[permission] === true);
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} state - Redux state
 * @param {string[]} requiredPermissions - Array of permission strings
 * @returns {boolean} - True if user has all permissions
 */
export const selectHasAllPermissions = (state, requiredPermissions) => {
  const permissions = state.auth.permissions;
  if (!permissions || !Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
    return false;
  }
  return requiredPermissions.every(permission => permissions[permission] === true);
};

/**
 * Check if user has a specific role
 * @param {Object} state - Redux state
 * @param {string} requiredRole - Required role to check
 * @returns {boolean} - True if user has the role
 */
export const selectHasRole = (state, requiredRole) => {
  const role = state.auth.role;
  if (!role || !requiredRole) return false;
  return role === requiredRole;
};

export default authSlice.reducer;

