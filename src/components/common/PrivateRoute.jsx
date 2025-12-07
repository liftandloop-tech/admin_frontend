import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { canAccessRoute, hasAnyPermission } from '../../utils/permissions';
import { PERMISSIONS } from '../../utils/permissions';

/**
 * PrivateRoute Component
 * 
 * Protects routes that require authentication.
 * Redirects to login if not authenticated.
 * Optionally checks permissions if required.
 * 
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string[]} requiredPermissions - Array of permissions required to access route
 * @param {string} requiredRole - Required role to access route
 * @param {string} redirectTo - Path to redirect if not authorized (default: '/login')
 */
const PrivateRoute = ({
  children,
  requiredPermissions = [],
  requiredRole = null,
  redirectTo = '/login',
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const permissions = useSelector((state) => state.auth.permissions);
  const role = useSelector((state) => state.auth.role);
  const location = useLocation();

  // Check authentication
  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && role !== requiredRole) {
    // Redirect to dashboard if role doesn't match
    return <Navigate to="/dashboard" replace />;
  }

  // Check permissions if required
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = hasAnyPermission(permissions, requiredPermissions);
    if (!hasPermission) {
      // Redirect to dashboard if no permission
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check route-level permissions
  const canAccess = canAccessRoute(permissions, location.pathname);
  if (!canAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

