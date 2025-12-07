import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllResellersQuery } from '../../store/api/endpoints/resellerApi';
import { selectIsAuthenticated, selectRole } from '../../features/auth/authSlice';

/**
 * UserManagementFilterBar Component
 * 
 * Filter controls for User Management table with:
 * - All Users dropdown
 * - Status dropdown
 * - All Resellers dropdown
 * - Reset Filters button
 * 
 * Props:
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when filter changes
 * @param {Function} onReset - Callback when reset is clicked
 */
const UserManagementFilterBar = ({ filters, onFilterChange, onReset }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  
  // Fetch resellers for dropdown - only for super admins
  // Resellers don't need this filter as they only see their own assigned salons
  const { data: resellersData } = useGetAllResellersQuery(
    { page: 1, limit: 100 },
    { 
      skip: !isAuthenticated || role === 'reseller' // Skip if not authenticated or if reseller
    }
  );
  const resellers = resellersData?.resellers || [];

  // Reset all filters to default values
  const handleReset = () => {
    onReset();
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-700">Filter User</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {/* All Users Dropdown */}
        <div className="relative">
          <select
            value={filters.allUsers}
            onChange={(e) => onFilterChange('allUsers', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Users">All Users</option>
            <option value="Active Users">Active Users</option>
            <option value="Inactive Users">Inactive Users</option>
            <option value="Pending Users">Pending Users</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Status">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* All Resellers Dropdown - Only show for super admins */}
        {role === 'super_admin' && (
          <div className="relative">
            <select
              value={filters.allResellers}
              onChange={(e) => onFilterChange('allResellers', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Resellers">All Resellers</option>
              {resellers.map((reseller) => (
                <option key={reseller._id || reseller.id} value={reseller.name || reseller.resellerId}>
                  {reseller.name || reseller.resellerId || 'N/A'}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

        {/* Reset Filters Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

export default UserManagementFilterBar;

