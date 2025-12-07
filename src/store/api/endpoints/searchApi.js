import { baseApi } from '../baseApi';

/**
 * Search API Endpoints
 * 
 * Handles all search-related API calls including:
 * - Advanced search salons
 * - Advanced search resellers
 * - Advanced search licenses
 * - Global search
 */

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Advanced Search Salons
     * GET /api/search/salons?query=&page=1&limit=10
     * Permission: salon:manageAll (super_admin only)
     */
    advancedSearchSalons: builder.query({
      query: (params = {}) => {
        const { query = '', page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('query', query);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        
        return {
          url: '/api/search/salons',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            results: response.data.results || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      providesTags: ['Salon'],
    }),

    /**
     * Advanced Search Resellers
     * GET /api/search/resellers?query=&page=1&limit=10
     * Permission: reseller:manage (super_admin only)
     */
    advancedSearchResellers: builder.query({
      query: (params = {}) => {
        const { query = '', page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('query', query);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        
        return {
          url: '/api/search/resellers',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            results: response.data.results || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      providesTags: ['Reseller'],
    }),

    /**
     * Advanced Search Licenses
     * GET /api/search/licenses?query=&page=1&limit=10
     * Permission: license:generate (super_admin only)
     */
    advancedSearchLicenses: builder.query({
      query: (params = {}) => {
        const { query = '', page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('query', query);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        
        return {
          url: '/api/search/licenses',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            results: response.data.results || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      providesTags: ['License'],
    }),

    /**
     * Global Search
     * GET /api/search/global?query=&page=1&limit=10
     * Permission: Multiple (super_admin only)
     */
    globalSearch: builder.query({
      query: (params = {}) => {
        const { query = '', page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('query', query);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        
        return {
          url: '/api/search/global',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            results: response.data.results || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      providesTags: ['Salon', 'Reseller', 'License'],
    }),
  }),
});

export const {
  useAdvancedSearchSalonsQuery,
  useAdvancedSearchResellersQuery,
  useAdvancedSearchLicensesQuery,
  useGlobalSearchQuery,
  useLazyAdvancedSearchSalonsQuery,
  useLazyAdvancedSearchResellersQuery,
  useLazyAdvancedSearchLicensesQuery,
  useLazyGlobalSearchQuery,
} = searchApi;

