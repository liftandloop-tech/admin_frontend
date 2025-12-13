import { baseApi } from '../baseApi';

/**
 * User Management API Endpoints
 * 
 * Handles all salon/restaurant management API calls including:
 * - Get all salons (with filters)
 * - Get salon detail
 * - Create salon
 * - Update salon
 * - Extend plan
 * - Deactivate key
 * - Get salon revenue analytics
 * - Get salon customers
 * - Get salon activity log
 */

export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get All Salons (Super Admin)
     * GET /api/super-admin/salons?page=1&limit=10&search=&status=&resellerId=
     * Permission: salon:manageAll (super_admin only)
     */
    getAllSalons: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search = '', status = '', resellerId = '', businessType = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (resellerId) queryParams.append('resellerId', resellerId);
        // Backend uses 'businessType' query param, not 'businessCategory'
        if (businessType) queryParams.append('businessType', businessType);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);
        
        return {
          url: '/api/super-admin/salons',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            salons: response.data.salons || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      providesTags: ['Salon'],
    }),

    /**
     * Get Reseller's Assigned Salons
     * GET /api/reseller/salons?page=1&limit=10&search=&status=
     * Permission: salon:manageAssigned (reseller only)
     */
    getResellerSalons: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search = '', status = '', businessCategory = '' } = params;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (businessCategory) queryParams.append('businessCategory', businessCategory);
        
        return {
          url: '/api/reseller/salons',
          params: Object.fromEntries(queryParams),
        };
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return {
            salons: response.data.salons || response.data,
            pagination: response.pagination || response.data.pagination,
          };
        }
        return response;
      },
      providesTags: ['Salon'],
    }),

    /**
     * Get Salon Detail (Super Admin)
     * GET /api/super-admin/salons/:id
     * Permission: salon:manageAll
     */
    getSalonDetail: builder.query({
      query: (id) => `/api/super-admin/salons/${encodeURIComponent(id)}`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.salon || response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Salon', id }],
    }),

    /**
     * Get Reseller's Salon Detail
     * GET /api/reseller/salons/:id
     * Permission: salon:manageAssigned
     */
    getResellerSalonDetail: builder.query({
      query: (id) => `/api/reseller/salons/${encodeURIComponent(id)}`,
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Salon', id }],
    }),

    /**
     * Create Salon
     * POST /api/super-admin/salons
     * Permission: salon:manageAll
     */
    createSalon: builder.mutation({
      query: (salonData) => ({
        url: '/api/super-admin/salons',
        method: 'POST',
        body: salonData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.salon || response.data;
        }
        return response;
      },
      invalidatesTags: ['Salon'],
    }),

    /**
     * Update Salon (Super Admin)
     * PUT /api/super-admin/salons/:id
     * Permission: salon:manageAll
     */
    updateSalon: builder.mutation({
      query: ({ id, ...salonData }) => ({
        url: `/api/super-admin/salons/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: salonData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.salon || response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Salon', id },
        'Salon',
      ],
    }),

    /**
     * Update Reseller's Salon
     * PUT /api/reseller/salons/:id
     * Permission: salon:manageAssigned
     */
    updateResellerSalon: builder.mutation({
      query: ({ id, ...salonData }) => ({
        url: `/api/reseller/salons/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: salonData,
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.salon || response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Salon', id },
        'Salon',
      ],
    }),

    /**
     * Extend Plan
     * POST /api/super-admin/salons/:id/extend-plan
     * Permission: salon:manageAll or salon:manageAssigned
     * 
     * Body parameters (at least one required):
     * - extendByMonths: number (optional) - Number of months to extend
     * - newEndDateISO: string (optional) - ISO date string for new expiry date
     * - additionalCostINR: number (optional) - Additional cost in INR
     * - notes: string (optional) - Notes about the extension
     * - notify: boolean (optional) - Whether to notify the salon owner via email
     */
    extendPlan: builder.mutation({
      query: ({ id, extendByMonths, newEndDateISO, additionalCostINR, notes, notify }) => ({
        url: `/api/super-admin/salons/${encodeURIComponent(id)}/extend-plan`,
        method: 'POST',
        body: {
          ...(extendByMonths !== undefined && { extendByMonths }),
          ...(newEndDateISO && { newEndDateISO }),
          ...(additionalCostINR !== undefined && { additionalCostINR }),
          ...(notes && { notes }),
          ...(notify !== undefined && { notify }),
        },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Salon', id },
        'Salon',
        'License',
        'Activity',
      ],
    }),

    /**
     * Deactivate Key
     * POST /api/super-admin/salons/:id/deactivate-key
     * Permission: salon:manageAll or salon:manageAssigned
     * 
     * Body parameters:
     * - type: string (required) - "temporary" or "permanent"
     * - reason: string (required) - Reason for deactivation
     * - effectiveFrom: string (optional) - ISO date string, defaults to now
     * - notifyOwner: boolean (optional) - Whether to notify the salon owner via email
     * - attachAudit: boolean (optional) - Whether to attach audit report to notification
     * - allowReactivation: boolean (optional) - Whether reactivation is allowed
     */
    deactivateKey: builder.mutation({
      query: ({ id, type, reason, effectiveFrom, notifyOwner, attachAudit, allowReactivation }) => ({
        url: `/api/super-admin/salons/${encodeURIComponent(id)}/deactivate-key`,
        method: 'POST',
        body: {
          type,
          reason,
          ...(effectiveFrom && { effectiveFrom }),
          ...(notifyOwner !== undefined && { notifyOwner }),
          ...(attachAudit !== undefined && { attachAudit }),
          ...(allowReactivation !== undefined && { allowReactivation }),
        },
      }),
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Salon', id },
        'Salon',
        'License',
        'Activity',
      ],
    }),

    /**
     * Get Salon Revenue Analytics
     * GET /api/super-admin/salons/:id/revenue-analytics
     * Permission: salon:manageAll or salon:manageAssigned
     */
    getSalonRevenue: builder.query({
      query: ({ id, period = 'month', startDate, endDate }) => {
        const queryParams = new URLSearchParams();
        if (period) queryParams.append('period', period);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        const queryString = queryParams.toString();
        return `/api/super-admin/salons/${encodeURIComponent(id)}/revenue-analytics${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Salon', id }],
    }),

    /**
     * Get Salon Customers
     * GET /api/super-admin/salons/:id/customers
     * Permission: salon:manageAll or salon:manageAssigned
     */
    getSalonCustomers: builder.query({
      query: ({ id, page = 1, limit = 10, search = '' }) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        const queryString = queryParams.toString();
        return `/api/super-admin/salons/${encodeURIComponent(id)}/customers${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Salon', id }],
    }),

    /**
     * Get Salon Activity Log
     * GET /api/super-admin/salons/:id/activity-log
     * Permission: salon:manageAll or salon:manageAssigned
     */
    getSalonActivity: builder.query({
      query: ({ id, page = 1, limit = 10 }) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        const queryString = queryParams.toString();
        return `/api/super-admin/salons/${encodeURIComponent(id)}/activity-log${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Salon', id }, 'Activity'],
    }),
  }),
});

export const {
  useGetAllSalonsQuery,
  useGetResellerSalonsQuery,
  useGetSalonDetailQuery,
  useGetResellerSalonDetailQuery,
  useCreateSalonMutation,
  useUpdateSalonMutation,
  useUpdateResellerSalonMutation,
  useExtendPlanMutation,
  useDeactivateKeyMutation,
  useGetSalonRevenueQuery,
  useGetSalonCustomersQuery,
  useGetSalonActivityQuery,
} = userManagementApi;

