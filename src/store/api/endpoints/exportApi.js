import { baseApi } from '../baseApi';

/**
 * Export API Endpoints
 * 
 * Handles all data export-related API calls including:
 * - Export resellers
 * - Export salons
 * - Export licenses
 * - Export activity logs
 */

export const exportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Export Resellers
     * GET /api/super-admin/export/resellers?format=csv
     * Permission: export:data (super_admin only)
     */
    exportResellers: builder.query({
      query: (format = 'csv') => ({
        url: '/api/super-admin/export/resellers',
        params: { format },
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `resellers-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return { success: true };
        },
      }),
      transformResponse: (response) => {
        return { success: true };
      },
    }),

    /**
     * Export Salons
     * GET /api/super-admin/export/salons?format=csv
     * Permission: export:data (super_admin only)
     */
    exportSalons: builder.query({
      query: (format = 'csv') => ({
        url: '/api/super-admin/export/salons',
        params: { format },
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `salons-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return { success: true };
        },
      }),
      transformResponse: (response) => {
        return { success: true };
      },
    }),

    /**
     * Export Licenses
     * GET /api/super-admin/export/licenses?format=csv
     * Permission: export:data (super_admin only)
     */
    exportLicenses: builder.query({
      query: (format = 'csv') => ({
        url: '/api/super-admin/export/licenses',
        params: { format },
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `licenses-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return { success: true };
        },
      }),
      transformResponse: (response) => {
        return { success: true };
      },
    }),

    /**
     * Export Activity Logs
     * GET /api/super-admin/export/activity-logs?format=csv
     * Permission: export:data (super_admin only)
     */
    exportActivityLogs: builder.query({
      query: (format = 'csv') => ({
        url: '/api/super-admin/export/activity-logs',
        params: { format },
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return { success: true };
        },
      }),
      transformResponse: (response) => {
        return { success: true };
      },
    }),
  }),
});

export const {
  useLazyExportResellersQuery,
  useLazyExportSalonsQuery,
  useLazyExportLicensesQuery,
  useLazyExportActivityLogsQuery,
} = exportApi;

