import { baseApi } from '../baseApi';

/**
 * License API Endpoints
 * 
 * Handles all license-related API calls including:
 * - Generate license
 * - Get license statistics
 * - Get pending requests
 * - Approve/reject requests
 * - Get recent activities
 * - Get license insights
 * - Get activity log
 */

export const licenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Generate License
     * POST /api/super-admin/licenses/generate (for super_admin)
     * POST /api/reseller/licenses/generate (for reseller)
     * Permission: license:generate
     */
    createLicense: builder.mutation({
      queryFn: async (licenseData, api, extraOptions, baseQuery) => {
        // Get role from Redux state
        const state = api.getState();
        const role = state?.auth?.role || 'super_admin';
        
        // Determine endpoint based on user role
        const url = role === 'reseller' 
          ? '/api/reseller/licenses/generate'
          : '/api/super-admin/licenses/generate';
        
        return baseQuery({
          url,
          method: 'POST',
          body: licenseData,
        });
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          // Return both license and salon data for the frontend
          const license = response.data.license || {};
          return {
            ...license,
            salon: response.data.salon,
            // Ensure licenseKey and expiryDate are at top level for easy access
            licenseKey: license.licenseKey || response.data.licenseKey,
            expiryDate: license.expiryDate || response.data.expiryDate,
          };
        }
        return response;
      },
      invalidatesTags: ['License', 'Salon', 'Activity'],
    }),

    /**
     * Get License Statistics
     * GET /api/super-admin/licenses/stats
     * Permission: license:generate (super_admin only)
     */
    getLicenseStats: builder.query({
      query: () => '/api/super-admin/licenses/stats',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Get Pending Requests
     * GET /api/super-admin/licenses/pending-requests
     * Permission: license:approveReject (super_admin only)
     */
    getPendingRequests: builder.query({
      query: () => '/api/super-admin/licenses/pending-requests',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.requests || response.data;
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Approve Request
     * POST /api/super-admin/licenses/pending-requests/:id/approve
     * Permission: license:approveReject (super_admin only)
     */
    approveRequest: builder.mutation({
      query: (id) => ({
        url: `/api/super-admin/licenses/pending-requests/${id}/approve`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ['License', 'Salon', 'Activity'],
    }),

    /**
     * Reject Request
     * POST /api/super-admin/licenses/pending-requests/:id/reject
     * Permission: license:approveReject (super_admin only)
     */
    rejectRequest: builder.mutation({
      query: (id) => ({
        url: `/api/super-admin/licenses/pending-requests/${id}/reject`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ['License', 'Salon', 'Activity'],
    }),

    /**
     * Get Recent Activities
     * GET /api/super-admin/licenses/recent-activities
     * Permission: license:generate (super_admin only)
     */
    getRecentActivities: builder.query({
      query: () => '/api/super-admin/licenses/recent-activities',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.activities || response.data;
        }
        return response;
      },
      providesTags: ['License', 'Activity'],
    }),

    /**
     * Get Type Distribution
     * GET /api/super-admin/licenses/type-distribution
     * Permission: license:generate (super_admin only)
     */
    getTypeDistribution: builder.query({
      query: () => '/api/super-admin/licenses/type-distribution',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Get Renewal Ratio
     * GET /api/super-admin/licenses/renewal-ratio
     * Permission: license:generate (super_admin only)
     */
    getRenewalRatio: builder.query({
      query: () => '/api/super-admin/licenses/renewal-ratio',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Get Generation Trend
     * GET /api/super-admin/licenses/generation-trend
     * Permission: license:generate (super_admin only)
     */
    getGenerationTrend: builder.query({
      query: () => '/api/super-admin/licenses/generation-trend',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Get License Insights
     * GET /api/super-admin/licenses/insights
     * Permission: license:generate (super_admin only)
     */
    getLicenseInsights: builder.query({
      query: () => '/api/super-admin/licenses/insights',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Get Dashboard Status
     * GET /api/super-admin/licenses/dashboard-status
     * Permission: license:generate (super_admin only)
     */
    getDashboardStatus: builder.query({
      query: () => '/api/super-admin/licenses/dashboard-status',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Get Activity Log
     * GET /api/super-admin/licenses/activity-log?page=1&limit=10&eventType=&salonId=
     * Permission: license:generate (super_admin only)
     */
    getActivityLog: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, eventType = '', salonId = '' } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (eventType) queryParams.append('eventType', eventType);
        if (salonId) queryParams.append('salonId', salonId);
        
        return {
          url: '/api/super-admin/licenses/activity-log',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            logs: response.data.logs || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      providesTags: ['Activity'],
    }),

    /**
     * Get Activity Log Summary
     * GET /api/super-admin/licenses/activity-log/summary
     * Permission: license:generate (super_admin only)
     */
    getActivityLogSummary: builder.query({
      query: () => '/api/super-admin/licenses/activity-log/summary',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Activity'],
    }),

    /**
     * Get Activity Distribution
     * GET /api/super-admin/licenses/activity-log/distribution
     * Permission: license:generate (super_admin only)
     */
    getActivityDistribution: builder.query({
      query: () => '/api/super-admin/licenses/activity-log/distribution',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Activity'],
    }),

    /**
     * Get Activity Volume
     * GET /api/super-admin/licenses/activity-log/volume
     * Permission: license:generate (super_admin only)
     */
    getActivityVolume: builder.query({
      query: () => '/api/super-admin/licenses/activity-log/volume',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Activity'],
    }),
  }),
});

export const {
  useCreateLicenseMutation,
  useGetLicenseStatsQuery,
  useGetPendingRequestsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
  useGetRecentActivitiesQuery,
  useGetTypeDistributionQuery,
  useGetRenewalRatioQuery,
  useGetGenerationTrendQuery,
  useGetLicenseInsightsQuery,
  useGetDashboardStatusQuery,
  useGetActivityLogQuery,
  useGetActivityLogSummaryQuery,
  useGetActivityDistributionQuery,
  useGetActivityVolumeQuery,
} = licenseApi;

