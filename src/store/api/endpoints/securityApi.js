import { baseApi } from '../baseApi';

/**
 * Security API Endpoints
 * 
 * Handles all security-related API calls including:
 * - Password management (forgot, reset, change)
 * - Two-factor authentication (setup, verify, disable)
 * - Email verification (send, verify)
 * - Session management (get active sessions, revoke)
 */

export const securityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== PASSWORD MANAGEMENT ====================
    
    /**
     * Forgot Password - Super Admin
     * POST /api/super-admin/password/forgot
     */
    forgotPasswordSuperAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/super-admin/password/forgot',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Reset Password - Super Admin
     * POST /api/super-admin/password/reset
     */
    resetPasswordSuperAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/super-admin/password/reset',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Change Password - Super Admin
     * POST /api/super-admin/password/change
     */
    changePasswordSuperAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/super-admin/password/change',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Forgot Password - Reseller
     * POST /api/reseller/password/forgot
     */
    forgotPasswordReseller: builder.mutation({
      query: (data) => ({
        url: '/api/reseller/password/forgot',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Reset Password - Reseller
     * POST /api/reseller/password/reset
     */
    resetPasswordReseller: builder.mutation({
      query: (data) => ({
        url: '/api/reseller/password/reset',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Change Password - Reseller
     * POST /api/reseller/password/change
     */
    changePasswordReseller: builder.mutation({
      query: (data) => ({
        url: '/api/reseller/password/change',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // ==================== TWO-FACTOR AUTHENTICATION ====================

    /**
     * Setup 2FA - Super Admin
     * POST /api/super-admin/2fa/setup
     */
    setup2FASuperAdmin: builder.mutation({
      query: () => ({
        url: '/api/super-admin/2fa/setup',
        method: 'POST',
      }),
    }),

    /**
     * Verify and Enable 2FA - Super Admin
     * POST /api/super-admin/2fa/verify
     */
    verifyAndEnable2FASuperAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/super-admin/2fa/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Disable 2FA - Super Admin
     * POST /api/super-admin/2fa/disable
     */
    disable2FASuperAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/super-admin/2fa/disable',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Setup 2FA - Reseller
     * POST /api/reseller/2fa/setup
     */
    setup2FAReseller: builder.mutation({
      query: () => ({
        url: '/api/reseller/2fa/setup',
        method: 'POST',
      }),
    }),

    /**
     * Verify and Enable 2FA - Reseller
     * POST /api/reseller/2fa/verify
     */
    verifyAndEnable2FAReseller: builder.mutation({
      query: (data) => ({
        url: '/api/reseller/2fa/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Disable 2FA - Reseller
     * POST /api/reseller/2fa/disable
     */
    disable2FAReseller: builder.mutation({
      query: (data) => ({
        url: '/api/reseller/2fa/disable',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // ==================== EMAIL VERIFICATION ====================

    /**
     * Send Verification Email - Super Admin
     * POST /api/super-admin/email/verify/send
     */
    sendVerificationEmailSuperAdmin: builder.mutation({
      query: () => ({
        url: '/api/super-admin/email/verify/send',
        method: 'POST',
      }),
    }),

    /**
     * Verify Email - Super Admin
     * POST /api/super-admin/email/verify
     */
    verifyEmailSuperAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/super-admin/email/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Send Verification Email - Reseller
     * POST /api/reseller/email/verify/send
     */
    sendVerificationEmailReseller: builder.mutation({
      query: () => ({
        url: '/api/reseller/email/verify/send',
        method: 'POST',
      }),
    }),

    /**
     * Verify Email - Reseller
     * POST /api/reseller/email/verify
     */
    verifyEmailReseller: builder.mutation({
      query: (data) => ({
        url: '/api/reseller/email/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // ==================== SESSION MANAGEMENT ====================

    /**
     * Get Active Sessions - Super Admin
     * GET /api/super-admin/sessions
     */
    getActiveSessionsSuperAdmin: builder.query({
      query: () => '/api/super-admin/sessions',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.sessions || response.data;
        }
        return response;
      },
      providesTags: ['User'],
    }),

    /**
     * Revoke Session - Super Admin
     * DELETE /api/super-admin/sessions/:sessionId
     */
    revokeSessionSuperAdmin: builder.mutation({
      query: (sessionId) => ({
        url: `/api/super-admin/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Revoke All Sessions - Super Admin
     * DELETE /api/super-admin/sessions
     */
    revokeAllSessionsSuperAdmin: builder.mutation({
      query: () => ({
        url: '/api/super-admin/sessions',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Get Active Sessions - Reseller
     * GET /api/reseller/sessions
     */
    getActiveSessionsReseller: builder.query({
      query: () => '/api/reseller/sessions',
      transformResponse: (response) => {
        if (response.success && response.data) {
          return response.data.sessions || response.data;
        }
        return response;
      },
      providesTags: ['User'],
    }),

    /**
     * Revoke Session - Reseller
     * DELETE /api/reseller/sessions/:sessionId
     */
    revokeSessionReseller: builder.mutation({
      query: (sessionId) => ({
        url: `/api/reseller/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Revoke All Sessions - Reseller
     * DELETE /api/reseller/sessions
     */
    revokeAllSessionsReseller: builder.mutation({
      query: () => ({
        url: '/api/reseller/sessions',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  // Password Management
  useForgotPasswordSuperAdminMutation,
  useResetPasswordSuperAdminMutation,
  useChangePasswordSuperAdminMutation,
  useForgotPasswordResellerMutation,
  useResetPasswordResellerMutation,
  useChangePasswordResellerMutation,
  // Two-Factor Authentication
  useSetup2FASuperAdminMutation,
  useVerifyAndEnable2FASuperAdminMutation,
  useDisable2FASuperAdminMutation,
  useSetup2FAResellerMutation,
  useVerifyAndEnable2FAResellerMutation,
  useDisable2FAResellerMutation,
  // Email Verification
  useSendVerificationEmailSuperAdminMutation,
  useVerifyEmailSuperAdminMutation,
  useSendVerificationEmailResellerMutation,
  useVerifyEmailResellerMutation,
  // Session Management
  useGetActiveSessionsSuperAdminQuery,
  useRevokeSessionSuperAdminMutation,
  useRevokeAllSessionsSuperAdminMutation,
  useGetActiveSessionsResellerQuery,
  useRevokeSessionResellerMutation,
  useRevokeAllSessionsResellerMutation,
} = securityApi;

