import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./components/dashboard-components/Sidebar";
import DashboardHeader from "./components/dashboard-components/DashboardHeader";
import MetricCard from "./components/dashboard-components/MetricCard";
import RecentActivity from "./components/dashboard-components/RecentActivity";
import {
  useGetPlatformStatsQuery,
  useGetResellerStatsQuery,
} from "./store/api/endpoints/dashboardApi";
import { selectRole, selectIsAuthenticated } from "./features/auth/authSlice";

/**
 * Dashboard Component - Main Landing Page
 *
 * This is the primary dashboard page that displays:
 * - Key business metrics (Total Businesses, Customers, Revenue, Active Keys)
 * - Recent activity table with filtering and pagination
 * - Sidebar navigation for accessing other sections
 *
 * Component Structure:
 * - Sidebar: Left navigation panel (fixed width)
 * - Main Content: Scrollable area with dashboard content
 *   - DashboardHeader: Title and description
 *   - MetricCard(s): Four metric cards in a responsive grid
 *   - RecentActivity: Table with filters and pagination
 *
 * Routing:
 * - Accessible at "/dashboard" route
 * - Default route "/" redirects here
 *
 * Features:
 * - Dynamic metrics from backend API
 * - Role-based data fetching (Super Admin vs Reseller)
 * - Loading and error states implemented
 *
 * To add new sections:
 * - Create new components in dashboard-components folder
 * - Import and add below RecentActivity section
 */
const Dashboard = () => {
  const role = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Fetch stats based on role
  const { 
    data: platformStats, 
    isLoading: isLoadingPlatformStats,
    error: platformStatsError 
  } = useGetPlatformStatsQuery(undefined, {
    skip: !isAuthenticated || role !== 'super_admin', // Skip if not authenticated or not super_admin
  });
  
  const { 
    data: resellerStats, 
    isLoading: isLoadingResellerStats,
    error: resellerStatsError 
  } = useGetResellerStatsQuery(undefined, {
    skip: !isAuthenticated || role !== 'reseller', // Skip if not authenticated or not reseller
  });

  // Use appropriate stats based on role
  const stats = role === 'super_admin' ? platformStats : resellerStats;
  const isLoading = role === 'super_admin' ? isLoadingPlatformStats : isLoadingResellerStats;
  const error = role === 'super_admin' ? platformStatsError : resellerStatsError;

  // Format numbers with commas
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Icon components for metric cards
  const BuildingIcon = () => (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  const CustomersIcon = () => (
    <svg
      className="w-6 h-6 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  const ResellersIcon = () => (
    <svg
      className="w-6 h-6 text-purple-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 9H6a4 4 0 00-4 4v1M18 9h2a4 4 0 014 4v1"
      />
    </svg>
  );

  const KeyIcon = () => (
    <svg
      className="w-6 h-6 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <DashboardHeader />

          {/* Metrics Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">Failed to load dashboard statistics. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                icon={<BuildingIcon />}
                value={formatNumber(stats?.totalBusinesses || 0)}
                label="Total Businesses"
                iconBgColor="bg-blue-100"
              />
              <MetricCard
                icon={<CustomersIcon />}
                value={formatNumber(stats?.totalCustomers || 0)}
                label="Total Customers"
                iconBgColor="bg-green-100"
              />
              {role === 'super_admin' && (
                <MetricCard
                  icon={<ResellersIcon />}
                  value={formatNumber(stats?.totalResellers || 0)}
                  label="Total Resellers"
                  iconBgColor="bg-purple-100"
                />
              )}
              <MetricCard
                icon={<KeyIcon />}
                value={formatNumber(stats?.activeKeys || stats?.activeSubscriptions || 0)}
                label={role === 'super_admin' ? "Active Keys" : "Active Subscriptions"}
                iconBgColor="bg-red-100"
              />
            </div>
          )}

          {/* Recent Activity Section */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
