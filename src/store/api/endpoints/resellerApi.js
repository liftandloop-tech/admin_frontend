import { baseApi } from '../baseApi';

/**
 * Reseller API Endpoints
 * 
 * Handles all reseller-related API calls including:
 * - Get all resellers
 * - Get reseller by ID
 * - Create reseller
 * - Update reseller
 * - Delete reseller
 * - Toggle reseller status
 * - Assign salon to reseller
 * - Unassign salon from reseller
 * - Get reseller stats
 * - Get reseller performance
 */

export const resellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get All Resellers
     * GET /api/super-admin/resellers?page=1&limit=10&search=&status=
     * Permission: reseller:manage (super_admin only)
     */
    getAllResellers: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search = '', status = '' } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        
        return {
          url: '/api/super-admin/resellers',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            resellers: response.data.resellers || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      transformErrorResponse: (response) => {
        // Transform error response to include backend error message
        return {
          status: response.status,
          data: {
            message: response.data?.message || response.data?.error || 'Failed to fetch resellers',
            error: response.data?.error || response.data,
          },
        };
      },
      providesTags: ['Reseller'],
    }),

    /**
     * Get Reseller by ID
     * GET /api/super-admin/resellers/:id
     * Permission: reseller:manage (super_admin only)
     */
    getResellerById: builder.query({
      query: (id) => `/api/super-admin/resellers/${id}`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.reseller || response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Reseller', id }],
    }),

    /**
     * Create Reseller
     * POST /api/super-admin/resellers
     * Permission: reseller:create (super_admin only)
     */
    createReseller: builder.mutation({
      query: (resellerData) => ({
        url: '/api/super-admin/resellers',
        method: 'POST',
        body: resellerData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.reseller || response.data;
        }
        return response;
      },
      invalidatesTags: ['Reseller'],
    }),

    /**
     * Update Reseller
     * PUT /api/super-admin/resellers/:id
     * Permission: reseller:manage (super_admin only)
     */
    updateReseller: builder.mutation({
      query: ({ id, ...resellerData }) => ({
        url: `/api/super-admin/resellers/${id}`,
        method: 'PUT',
        body: resellerData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.reseller || response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Reseller', id },
        'Reseller',
      ],
    }),

    /**
     * Delete Reseller
     * DELETE /api/super-admin/resellers/:id
     * Permission: reseller:manage (super_admin only)
     */
    deleteReseller: builder.mutation({
      query: (id) => ({
        url: `/api/super-admin/resellers/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Reseller', id },
        'Reseller',
      ],
    }),

    /**
     * Toggle Reseller Status
     * POST /api/super-admin/resellers/:id/toggle-status
     * Permission: reseller:manage (super_admin only)
     */
    toggleResellerStatus: builder.mutation({
      query: (id) => ({
        url: `/api/super-admin/resellers/${id}/toggle-status`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Reseller', id },
        'Reseller',
      ],
    }),

    /**
     * Assign Salon to Reseller
     * POST /api/super-admin/resellers/:id/assign-salon
     * Permission: salon:assignReseller (super_admin only)
     */
    assignSalonToReseller: builder.mutation({
      query: ({ id, salonId }) => ({
        url: `/api/super-admin/resellers/${id}/assign-salon`,
        method: 'POST',
        body: { salonId },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Reseller', id },
        'Reseller',
        'Salon',
      ],
    }),

    /**
     * Unassign Salon from Reseller
     * POST /api/super-admin/resellers/unassign-salon
     * Permission: salon:assignReseller (super_admin only)
     */
    unassignSalonFromReseller: builder.mutation({
      query: ({ resellerId, salonId }) => ({
        url: '/api/super-admin/resellers/unassign-salon',
        method: 'POST',
        body: { resellerId, salonId },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ['Reseller', 'Salon'],
    }),

    /**
     * Get Resellers Stats
     * GET /api/super-admin/resellers/stats
     * Permission: reseller:manage (super_admin only)
     */
    getResellersStats: builder.query({
      query: () => '/api/super-admin/resellers/stats',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Reseller'],
    }),

    /**
     * Get Reseller Performance
     * GET /api/super-admin/resellers/:id/performance
     * Permission: reseller:manage (super_admin only)
     */
    getResellerPerformance: builder.query({
      query: (id) => `/api/super-admin/resellers/${id}/performance`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Reseller', id }],
    }),
  }),
});

export const {
  useGetAllResellersQuery,
  useGetResellerByIdQuery,
  useCreateResellerMutation,
  useUpdateResellerMutation,
  useDeleteResellerMutation,
  useToggleResellerStatusMutation,
  useAssignSalonToResellerMutation,
  useUnassignSalonFromResellerMutation,
  useGetResellersStatsQuery,
  useGetResellerPerformanceQuery,
} = resellerApi;

