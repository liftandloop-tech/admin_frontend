import { baseApi } from '../baseApi';

/**
 * Subscription API Endpoints
 * 
 * Handles all subscription plan-related API calls including:
 * - Get all subscription plans
 * - Get plan detail
 * - Create plan
 * - Update plan
 * - Delete plan
 * - Get plan businesses
 * - Get plan analytics
 * - Get subscription stats
 */

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get All Subscription Plans
     * GET /api/super-admin/subscriptions/plans?page=1&limit=10&search=&status=
     * Permission: subscriptions:manage (super_admin only)
     */
    getSubscriptionPlans: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search = '', status = '' } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        
        return {
          url: '/api/super-admin/subscriptions/plans',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            plans: response.data,
            pagination: response.pagination,
          };
        }
        return response;
      },
      providesTags: ['Subscription'],
    }),

    /**
     * Get Subscription Stats
     * GET /api/super-admin/subscriptions/stats
     * Permission: subscriptions:manage (super_admin only)
     */
    getSubscriptionStats: builder.query({
      query: () => '/api/super-admin/subscriptions/stats',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ['Subscription'],
    }),

    /**
     * Get Plan Detail
     * GET /api/super-admin/subscriptions/plans/:name
     * Permission: subscriptions:manage (super_admin only)
     */
    getPlanDetail: builder.query({
      query: (name) => `/api/super-admin/subscriptions/plans/${encodeURIComponent(name)}`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.plan || response.data;
        }
        return response;
      },
      providesTags: (result, error, name) => [{ type: 'Subscription', id: name }],
    }),

    /**
     * Create Subscription Plan
     * POST /api/super-admin/subscriptions/plans
     * Permission: subscriptions:manage (super_admin only)
     */
    createSubscriptionPlan: builder.mutation({
      query: (planData) => ({
        url: '/api/super-admin/subscriptions/plans',
        method: 'POST',
        body: planData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.plan || response.data;
        }
        return response;
      },
      invalidatesTags: ['Subscription'],
    }),

    /**
     * Update Subscription Plan
     * PUT /api/super-admin/subscriptions/plans/:name
     * Permission: subscriptions:manage (super_admin only)
     */
    updateSubscriptionPlan: builder.mutation({
      query: ({ name, ...planData }) => ({
        url: `/api/super-admin/subscriptions/plans/${encodeURIComponent(name)}`,
        method: 'PUT',
        body: planData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.plan || response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { name }) => [
        { type: 'Subscription', id: name },
        'Subscription',
      ],
    }),

    /**
     * Delete Subscription Plan
     * DELETE /api/super-admin/subscriptions/plans/:name
     * Permission: subscriptions:manage (super_admin only)
     */
    deleteSubscriptionPlan: builder.mutation({
      query: (name) => ({
        url: `/api/super-admin/subscriptions/plans/${encodeURIComponent(name)}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, name) => [
        { type: 'Subscription', id: name },
        'Subscription',
      ],
    }),

    /**
     * Get Plan Businesses
     * GET /api/super-admin/subscriptions/plans/:name/businesses
     * Permission: subscriptions:manage (super_admin only)
     */
    getPlanBusinesses: builder.query({
      query: (name) => `/api/super-admin/subscriptions/plans/${encodeURIComponent(name)}/businesses`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.businesses || response.data;
        }
        return response;
      },
      providesTags: (result, error, name) => [{ type: 'Subscription', id: name }],
    }),

    /**
     * Get Plan Analytics
     * GET /api/super-admin/subscriptions/plans/:name/analytics
     * Permission: subscriptions:manage (super_admin only)
     */
    getPlanAnalytics: builder.query({
      query: (name) => `/api/super-admin/subscriptions/plans/${encodeURIComponent(name)}/analytics`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, name) => [{ type: 'Subscription', id: name }],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionStatsQuery,
  useGetPlanDetailQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useGetPlanBusinessesQuery,
  useGetPlanAnalyticsQuery,
} = subscriptionApi;

