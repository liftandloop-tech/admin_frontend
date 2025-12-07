import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./Dashboard";
import Login from "./Login";
import UserManagement from "./UserManagement";
import LicenseManagement from "./LicenseManagement";
import ResellerManagement from "./ResellerManagement";
import Profile from "./Profile";
import ManageUser from "./ManageUser";
import { PERMISSIONS } from "./utils/permissions";

/**
 * Main App Component with Routing Configuration
 *
 * This component sets up the routing structure for the QuickXPos Super Admin application
 * with role-based access control (RBAC) protection.
 *
 * Routing Structure:
 * - "/" (root) - Redirects based on authentication status
 * - "/login" - Login page (public)
 * - "/dashboard" - Main dashboard page (protected, requires analytics permission)
 * - "/user-management" - User Management page (protected, requires salon management permission)
 * - "/license-management" - License Management page (protected, requires license:generate permission)
 * - "/reseller-management" - Reseller Management page (protected, requires reseller:manage permission)
 * - "/profile" - Profile page (protected, accessible to all authenticated users)
 * - "/manage-user" - Manage User detail page (protected, requires salon management permission)
 *
 * All protected routes are wrapped with PrivateRoute component that checks:
 * - Authentication status
 * - Required permissions
 * - Route-level access control
 */
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route - redirects based on auth status */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Public Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard route - requires analytics permission */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              requiredPermissions={[
                PERMISSIONS.ANALYTICS_VIEW_PLATFORM,
                PERMISSIONS.ANALYTICS_VIEW_RESELLER,
              ]}
            >
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Protected User Management route - requires salon management permission */}
        <Route
          path="/user-management"
          element={
            <PrivateRoute
              requiredPermissions={[
                PERMISSIONS.SALON_MANAGE_ALL,
                PERMISSIONS.RESTAURANT_MANAGE_ALL,
                PERMISSIONS.SALON_MANAGE_ASSIGNED,
                PERMISSIONS.RESTAURANT_MANAGE_ASSIGNED,
              ]}
            >
              <UserManagement />
            </PrivateRoute>
          }
        />

        {/* Protected License Management route - requires license:generate or license:view permission */}
        <Route
          path="/license-management"
          element={
            <PrivateRoute
              requiredPermissions={[PERMISSIONS.LICENSE_GENERATE, PERMISSIONS.LICENSE_VIEW]}
            >
              <LicenseManagement />
            </PrivateRoute>
          }
        />

        {/* Protected Reseller Management route - requires reseller:manage permission (super_admin only) */}
        <Route
          path="/reseller-management"
          element={
            <PrivateRoute
              requiredPermissions={[PERMISSIONS.RESELLER_MANAGE]}
            >
              <ResellerManagement />
            </PrivateRoute>
          }
        />

        {/* Protected Manage User detail route - requires salon management permission */}
        <Route
          path="/manage-user/:id?"
          element={
            <PrivateRoute
              requiredPermissions={[
                PERMISSIONS.SALON_MANAGE_ALL,
                PERMISSIONS.RESTAURANT_MANAGE_ALL,
                PERMISSIONS.SALON_MANAGE_ASSIGNED,
                PERMISSIONS.RESTAURANT_MANAGE_ASSIGNED,
              ]}
            >
              <ManageUser />
            </PrivateRoute>
          }
        />

        {/* Protected Profile route - accessible to all authenticated users */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Catch-all route - redirects unknown paths to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
