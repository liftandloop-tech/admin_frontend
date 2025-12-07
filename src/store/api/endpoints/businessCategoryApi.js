import { baseApi } from '../baseApi';

/**
 * Business Category API Endpoints
 * 
 * Handles all business category-related API calls including:
 * - Get all categories
 * - Get category detail
 * - Create category
 * - Update category
 * - Delete category
 * - Get category businesses
 * - Get category stats
 * - Get category analytics
 */

export const businessCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get All Business Categories
     * GET /api/super-admin/business-categories?page=1&limit=10&search=&status=
     * Permission: categories:manage (super_admin only)
     */
    getBusinessCategories: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search = '', status = '' } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        
        return {
          url: '/api/super-admin/business-categories',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            categories: response.data,
            pagination: response.pagination,
          };
        }
        return response;
      },
      providesTags: ['BusinessCategory'],
    }),

    /**
     * Get Business Category Detail
     * GET /api/super-admin/business-categories/:name
     * Permission: categories:manage (super_admin only)
     */
    getBusinessCategoryDetail: builder.query({
      query: (name) => `/api/super-admin/business-categories/${encodeURIComponent(name)}`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.category || response.data;
        }
        return response;
      },
      providesTags: (result, error, name) => [{ type: 'BusinessCategory', id: name }],
    }),

    /**
     * Create Business Category
     * POST /api/super-admin/business-categories
     * Permission: categories:manage (super_admin only)
     */
    createBusinessCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/api/super-admin/business-categories',
        method: 'POST',
        body: categoryData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.category || response.data;
        }
        return response;
      },
      invalidatesTags: ['BusinessCategory'],
    }),

    /**
     * Update Business Category
     * PUT /api/super-admin/business-categories/:name
     * Permission: categories:manage (super_admin only)
     */
    updateBusinessCategory: builder.mutation({
      query: ({ name, ...categoryData }) => ({
        url: `/api/super-admin/business-categories/${encodeURIComponent(name)}`,
        method: 'PUT',
        body: categoryData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.category || response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { name }) => [
        { type: 'BusinessCategory', id: name },
        'BusinessCategory',
      ],
    }),

    /**
     * Delete Business Category
     * DELETE /api/super-admin/business-categories/:name
     * Permission: categories:manage (super_admin only)
     */
    deleteBusinessCategory: builder.mutation({
      query: (name) => ({
        url: `/api/super-admin/business-categories/${encodeURIComponent(name)}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, name) => [
        { type: 'BusinessCategory', id: name },
        'BusinessCategory',
      ],
    }),

    /**
     * Get Business Category Businesses
     * GET /api/super-admin/business-categories/:name/businesses
     * Permission: categories:manage (super_admin only)
     */
    getBusinessCategoryBusinesses: builder.query({
      query: (name) => `/api/super-admin/business-categories/${encodeURIComponent(name)}/businesses`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.businesses || response.data;
        }
        return response;
      },
      providesTags: (result, error, name) => [{ type: 'BusinessCategory', id: name }],
    }),

    /**
     * Get Business Category Stats
     * GET /api/super-admin/business-categories/:name/stats
     * Permission: categories:manage (super_admin only)
     */
    getBusinessCategoryStats: builder.query({
      query: (name) => `/api/super-admin/business-categories/${encodeURIComponent(name)}/stats`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, name) => [{ type: 'BusinessCategory', id: name }],
    }),

    /**
     * Get Business Category Analytics
     * GET /api/super-admin/business-categories/:name/analytics
     * Permission: categories:manage (super_admin only)
     */
    getBusinessCategoryAnalytics: builder.query({
      query: (name) => `/api/super-admin/business-categories/${encodeURIComponent(name)}/analytics`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, name) => [{ type: 'BusinessCategory', id: name }],
    }),
  }),
});

export const {
  useGetBusinessCategoriesQuery,
  useGetBusinessCategoryDetailQuery,
  useCreateBusinessCategoryMutation,
  useUpdateBusinessCategoryMutation,
  useDeleteBusinessCategoryMutation,
  useGetBusinessCategoryBusinessesQuery,
  useGetBusinessCategoryStatsQuery,
  useGetBusinessCategoryAnalyticsQuery,
} = businessCategoryApi;

