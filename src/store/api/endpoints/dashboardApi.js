import { baseApi } from '../baseApi';

/**
 * Dashboard API Endpoints
 * 
 * Handles all dashboard-related API calls including:
 * - Platform statistics
 * - Revenue trends
 * - Customer growth
 * - Order distribution
 * - Plan usage
 * - Recent activity
 */

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Platform Statistics
     * GET /api/super-admin/platform/stats
     * Permission: analytics:viewPlatform (super_admin only)
     */
    getPlatformStats: builder.query({
      query: () => '/api/super-admin/platform/stats',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Dashboard'],
    }),

    /**
     * Get Revenue Trend
     * GET /api/super-admin/platform/revenue-trend?period=6
     * Permission: analytics:viewPlatform (super_admin only)
     */
    getRevenueTrend: builder.query({
      query: (period = 6) => ({
        url: '/api/super-admin/platform/revenue-trend',
        params: { period },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Dashboard'],
    }),

    /**
     * Get Customer Growth
     * GET /api/super-admin/platform/customer-growth?period=6
     * Permission: analytics:viewPlatform (super_admin only)
     */
    getCustomerGrowth: builder.query({
      query: (period = 6) => ({
        url: '/api/super-admin/platform/customer-growth',
        params: { period },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Dashboard'],
    }),

    /**
     * Get Order Distribution
     * GET /api/super-admin/platform/order-distribution
     * Permission: analytics:viewPlatform (super_admin only)
     */
    getOrderDistribution: builder.query({
      query: () => '/api/super-admin/platform/order-distribution',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Dashboard'],
    }),

    /**
     * Get Plan Usage
     * GET /api/super-admin/platform/plan-usage
     * Permission: analytics:viewPlatform (super_admin only)
     */
    getPlanUsage: builder.query({
      query: () => '/api/super-admin/platform/plan-usage',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Dashboard'],
    }),

    /**
     * Get Recent Activity
     * GET /api/super-admin/platform/recent-activity?limit=10
     * Permission: analytics:viewPlatform (super_admin only)
     */
    getRecentActivity: builder.query({
      query: (limit = 10) => ({
        url: '/api/super-admin/platform/recent-activity',
        params: { limit },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Dashboard', 'Activity'],
    }),

    /**
     * Get Reseller Dashboard Stats (for resellers)
     * GET /api/reseller/dashboard/stats
     * Permission: analytics:viewReseller (reseller only)
     */
    getResellerStats: builder.query({
      query: () => '/api/reseller/dashboard/stats',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetPlatformStatsQuery,
  useGetRevenueTrendQuery,
  useGetCustomerGrowthQuery,
  useGetOrderDistributionQuery,
  useGetPlanUsageQuery,
  useGetRecentActivityQuery,
  useGetResellerStatsQuery,
} = dashboardApi;

