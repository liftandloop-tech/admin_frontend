import { baseApi } from '../baseApi';
import { getDefaultPermissions } from '../../../utils/permissions';

/**
 * Authentication API Endpoints
 * 
 * Handles all authentication-related API calls including:
 * - Super admin login/logout
 * - Reseller login/logout
 * - Profile management
 * - Token refresh
 */

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login as Super Admin
     * POST /api/super-admin/auth/login
     */
    loginSuperAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/api/super-admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        // Transform backend response to include permissions
        if (response.success && response.data) {
          const { user, accessToken, refreshToken } = response.data;
          return {
            user: {
              id: user._id || user.id,
              name: user.name,
              email: user.email,
            },
            role: user.role || 'super_admin',
            permissions: user.permissions || getDefaultPermissions('super_admin'),
            token: accessToken,
            refreshToken: refreshToken,
          };
        }
        return response;
      },
    }),

    /**
     * Login as Reseller
     * POST /api/reseller/auth/login
     */
    loginReseller: builder.mutation({
      query: (credentials) => ({
        url: '/api/reseller/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        // Transform backend response to include permissions
        if (response.success && response.data) {
          const { user, accessToken, refreshToken } = response.data;
          return {
            user: {
              id: user._id || user.id,
              name: user.name,
              email: user.email,
              resellerId: user.resellerId,
            },
            role: user.role || 'reseller',
            permissions: user.permissions || getDefaultPermissions('reseller'),
            token: accessToken,
            refreshToken: refreshToken,
          };
        }
        return response;
      },
    }),

    /**
     * Logout Super Admin
     * POST /api/super-admin/auth/logout
     */
    logoutSuperAdmin: builder.mutation({
      query: () => ({
        url: '/api/super-admin/auth/logout',
        method: 'POST',
      }),
    }),

    /**
     * Logout Reseller
     * POST /api/reseller/auth/logout
     */
    logoutReseller: builder.mutation({
      query: () => ({
        url: '/api/reseller/auth/logout',
        method: 'POST',
      }),
    }),

    /**
     * Get Super Admin Profile
     * GET /api/super-admin/auth/profile
     */
    getSuperAdminProfile: builder.query({
      query: () => '/api/super-admin/auth/profile',
      transformResponse: (response) => {
        if (response.success && response.data) {
          const { user } = response.data;
          return {
            user: {
              id: user._id || user.id,
              name: user.name,
              email: user.email,
            },
            role: user.role || 'super_admin',
            permissions: user.permissions || getDefaultPermissions('super_admin'),
          };
        }
        return response;
      },
      providesTags: ['User'],
    }),

    /**
     * Get Reseller Profile
     * GET /api/reseller/auth/profile
     */
    getResellerProfile: builder.query({
      query: () => '/api/reseller/auth/profile',
      transformResponse: (response) => {
        if (response.success && response.data) {
          const { user } = response.data;
          return {
            user: {
              id: user._id || user.id,
              name: user.name,
              email: user.email,
              resellerId: user.resellerId,
              contact: user.contact,
              address: user.address,
              city: user.city,
            },
            role: user.role || 'reseller',
            permissions: user.permissions || getDefaultPermissions('reseller'),
          };
        }
        return response;
      },
      providesTags: ['User'],
    }),

    /**
     * Update Reseller Profile
     * PUT /api/reseller/auth/profile
     */
    updateResellerProfile: builder.mutation({
      query: (data) => ({
        url: '/api/reseller/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Refresh Super Admin Token
     * POST /api/super-admin/auth/refresh-token
     */
    refreshSuperAdminToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/api/super-admin/auth/refresh-token',
        method: 'POST',
        body: { refresh_token: refreshToken },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            token: response.data.accessToken,
          };
        }
        return response;
      },
    }),

    /**
     * Refresh Reseller Token
     * POST /api/reseller/auth/refresh-token
     */
    refreshResellerToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/api/reseller/auth/refresh-token',
        method: 'POST',
        body: { refresh_token: refreshToken },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            token: response.data.accessToken,
          };
        }
        return response;
      },
    }),
  }),
});

export const {
  useLoginSuperAdminMutation,
  useLoginResellerMutation,
  useLogoutSuperAdminMutation,
  useLogoutResellerMutation,
  useGetSuperAdminProfileQuery,
  useGetResellerProfileQuery,
  useUpdateResellerProfileMutation,
  useRefreshSuperAdminTokenMutation,
  useRefreshResellerTokenMutation,
} = authApi;

