import React from 'react';
import { useSelector } from 'react-redux';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
} from '../../utils/permissions';

/**
 * PermissionGate Component
 * 
 * Conditionally renders children based on user permissions or role.
 * Useful for showing/hiding UI elements based on permissions.
 * 
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string} permission - Single permission to check
 * @param {string[]} anyPermission - Array of permissions (user needs at least one)
 * @param {string[]} allPermissions - Array of permissions (user needs all)
 * @param {string} role - Single role to check
 * @param {string[]} anyRole - Array of roles (user needs at least one)
 * @param {React.ReactNode} fallback - Component to render if not authorized (optional)
 * @param {boolean} showFallback - Whether to show fallback or nothing (default: false)
 */
const PermissionGate = ({
  children,
  permission = null,
  anyPermission = null,
  allPermissions = null,
  role = null,
  anyRole = null,
  fallback = null,
  showFallback = false,
}) => {
  const permissions = useSelector((state) => state.auth.permissions);
  const userRole = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return showFallback ? fallback : null;
  }

  let hasAccess = false;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permissions, permission, userRole);
    
    // Debug: Log permission check for LICENSE_GENERATE
    if (permission === 'license:generate' && userRole === 'reseller') {
      console.log('PermissionGate DEBUG - LICENSE_GENERATE check:', {
        permission,
        userRole,
        permissions,
        hasAccess,
        permissionValue: permissions?.[permission],
        hasPermissionResult: hasPermission(permissions, permission, userRole)
      });
    }
  }

  // Check any permission (OR logic)
  if (anyPermission && Array.isArray(anyPermission)) {
    hasAccess = hasAnyPermission(permissions, anyPermission, userRole);
  }

  // Check all permissions (AND logic)
  if (allPermissions && Array.isArray(allPermissions)) {
    hasAccess = hasAllPermissions(permissions, allPermissions, userRole);
  }

  // Check single role
  if (role) {
    hasAccess = hasRole(userRole, role);
  }

  // Check any role (OR logic)
  if (anyRole && Array.isArray(anyRole)) {
    hasAccess = hasAnyRole(userRole, anyRole);
  }

  // If no checks specified, allow access
  if (!permission && !anyPermission && !allPermissions && !role && !anyRole) {
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return showFallback ? fallback : null;
};

export default PermissionGate;

