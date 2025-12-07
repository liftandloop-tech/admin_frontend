/**
 * Permission Constants and Utilities
 * 
 * Defines all permission strings and provides helper functions
 * for checking user permissions and roles.
 */

// Permission Constants
export const PERMISSIONS = {
  // Reseller Management
  RESELLER_CREATE: "reseller:create",
  RESELLER_MANAGE: "reseller:manage",
  
  // License Management
  LICENSE_GENERATE: "license:generate",
  LICENSE_APPROVE_REJECT: "license:approveReject",
  LICENSE_VIEW: "license:view",
  
  // Business Management
  SALON_MANAGE_ALL: "salon:manageAll",
  RESTAURANT_MANAGE_ALL: "restaurant:manageAll",
  SALON_ASSIGN_RESELLER: "salon:assignReseller",
  RESTAURANT_ASSIGN_RESELLER: "restaurant:assignReseller",
  SALON_MANAGE_ASSIGNED: "salon:manageAssigned",
  RESTAURANT_MANAGE_ASSIGNED: "restaurant:manageAssigned",
  
  // Analytics
  ANALYTICS_VIEW_PLATFORM: "analytics:viewPlatform",
  ANALYTICS_VIEW_RESELLER: "analytics:viewReseller",
  
  // Categories & Subscriptions
  CATEGORIES_MANAGE: "categories:manage",
  SUBSCRIPTIONS_MANAGE: "subscriptions:manage",
  
  // Export
  EXPORT_DATA: "export:data",
};

// Role Constants
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  RESELLER: "reseller",
};

/**
 * Check if user has a specific permission
 * @param {Object} userPermissions - User's permissions object
 * @param {string} permission - Permission string to check
 * @param {string} userRole - Optional user role for role-based fallback
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (userPermissions, permission, userRole = null) => {
  if (!userPermissions || !permission) {
    // If we have a role, check default permissions as fallback
    if (userRole && userRole === ROLES.RESELLER && permission === PERMISSIONS.LICENSE_GENERATE) {
      return true; // Resellers always have LICENSE_GENERATE
    }
    return false;
  }
  
  // Direct check
  if (userPermissions[permission] === true) {
    return true;
  }
  
  // Fallback: For resellers checking LICENSE_GENERATE, always return true
  if (userRole === ROLES.RESELLER && permission === PERMISSIONS.LICENSE_GENERATE) {
    return true;
  }
  
  return false;
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} userPermissions - User's permissions object
 * @param {string[]} permissions - Array of permission strings
 * @returns {boolean} - True if user has at least one permission
 */
export const hasAnyPermission = (userPermissions, permissions, userRole = null) => {
  if (!userPermissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(userPermissions, permission, userRole));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} userPermissions - User's permissions object
 * @param {string[]} permissions - Array of permission strings
 * @returns {boolean} - True if user has all permissions
 */
export const hasAllPermissions = (userPermissions, permissions, userRole = null) => {
  if (!userPermissions || !Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(userPermissions, permission, userRole));
};

/**
 * Check if user has a specific role
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return userRole === requiredRole;
};

/**
 * Check if user has any of the specified roles
 * @param {string} userRole - User's role
 * @param {string[]} roles - Array of role strings
 * @returns {boolean} - True if user has at least one role
 */
export const hasAnyRole = (userRole, roles) => {
  if (!userRole || !Array.isArray(roles)) return false;
  return roles.includes(userRole);
};

/**
 * Route permission mapping
 * Maps routes to required permissions
 */
export const ROUTE_PERMISSIONS = {
  "/dashboard": [
    PERMISSIONS.ANALYTICS_VIEW_PLATFORM,
    PERMISSIONS.ANALYTICS_VIEW_RESELLER,
  ],
  "/user-management": [
    PERMISSIONS.SALON_MANAGE_ALL,
    PERMISSIONS.RESTAURANT_MANAGE_ALL,
    PERMISSIONS.SALON_MANAGE_ASSIGNED,
    PERMISSIONS.RESTAURANT_MANAGE_ASSIGNED,
  ],
  "/license-management": [PERMISSIONS.LICENSE_GENERATE, PERMISSIONS.LICENSE_VIEW],
  "/reseller-management": [PERMISSIONS.RESELLER_MANAGE],
  "/profile": [], // Accessible to all authenticated users
};

/**
 * Check if user can access a route
 * @param {Object} userPermissions - User's permissions object
 * @param {string} route - Route path
 * @returns {boolean} - True if user can access the route
 */
export const canAccessRoute = (userPermissions, route) => {
  const requiredPermissions = ROUTE_PERMISSIONS[route];
  
  // If no permissions required (like /profile), allow access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  
  // Check if user has any of the required permissions
  return hasAnyPermission(userPermissions, requiredPermissions);
};

/**
 * Get default permissions for a role
 * @param {string} role - User role
 * @returns {Object} - Default permissions object
 */
export const getDefaultPermissions = (role) => {
  if (role === ROLES.SUPER_ADMIN) {
    return {
      [PERMISSIONS.RESELLER_CREATE]: true,
      [PERMISSIONS.RESELLER_MANAGE]: true,
      [PERMISSIONS.LICENSE_GENERATE]: true,
      [PERMISSIONS.LICENSE_APPROVE_REJECT]: true,
      [PERMISSIONS.SALON_MANAGE_ALL]: true,
      [PERMISSIONS.RESTAURANT_MANAGE_ALL]: true,
      [PERMISSIONS.SALON_ASSIGN_RESELLER]: true,
      [PERMISSIONS.RESTAURANT_ASSIGN_RESELLER]: true,
      [PERMISSIONS.ANALYTICS_VIEW_PLATFORM]: true,
      [PERMISSIONS.ANALYTICS_VIEW_RESELLER]: true,
      [PERMISSIONS.CATEGORIES_MANAGE]: true,
      [PERMISSIONS.SUBSCRIPTIONS_MANAGE]: true,
      [PERMISSIONS.EXPORT_DATA]: true,
    };
  }
  
  if (role === ROLES.RESELLER) {
    return {
      [PERMISSIONS.RESELLER_CREATE]: false,
      [PERMISSIONS.RESELLER_MANAGE]: false,
      [PERMISSIONS.LICENSE_GENERATE]: true,
      [PERMISSIONS.LICENSE_APPROVE_REJECT]: false,
      [PERMISSIONS.LICENSE_VIEW]: true,
      [PERMISSIONS.SALON_MANAGE_ALL]: false,
      [PERMISSIONS.RESTAURANT_MANAGE_ALL]: false,
      [PERMISSIONS.SALON_ASSIGN_RESELLER]: false,
      [PERMISSIONS.RESTAURANT_ASSIGN_RESELLER]: false,
      [PERMISSIONS.SALON_MANAGE_ASSIGNED]: true,
      [PERMISSIONS.RESTAURANT_MANAGE_ASSIGNED]: true,
      [PERMISSIONS.ANALYTICS_VIEW_PLATFORM]: false,
      [PERMISSIONS.ANALYTICS_VIEW_RESELLER]: true,
      [PERMISSIONS.CATEGORIES_MANAGE]: false,
      [PERMISSIONS.SUBSCRIPTIONS_MANAGE]: false,
      [PERMISSIONS.EXPORT_DATA]: false,
    };
  }
  
  return {};
};

