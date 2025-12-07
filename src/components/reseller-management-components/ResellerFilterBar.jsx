import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAllResellersQuery } from '../../store/api/endpoints/resellerApi';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

/**
 * ResellerFilterBar Component
 * 
 * Filter controls for Reseller Management table with:
 * - Reseller Id dropdown
 * - Status dropdown
 * - Month dropdown
 * - Reset Filters button
 * 
 * Props:
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when filter changes
 * @param {Function} onReset - Callback when reset is clicked
 */
const ResellerFilterBar = ({ filters, onFilterChange, onReset }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Fetch resellers for dropdown
  const { data: resellersData } = useGetAllResellersQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthenticated } // Skip if not authenticated
  );
  const resellers = resellersData?.resellers || [];

  // Reset all filters to default values
  const handleReset = () => {
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter</h2>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Reseller Id Dropdown */}
        <div className="relative">
          <select
            value={filters.resellerId}
            onChange={(e) => onFilterChange('resellerId', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Reseller Id">Reseller Id</option>
            {resellers.map((reseller) => (
              <option key={reseller._id || reseller.id} value={reseller.resellerId || reseller._id}>
                {reseller.resellerId || reseller._id?.slice(-6) || 'N/A'}
              </option>
            ))}
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

        {/* Month Dropdown */}
        <div className="relative">
          <select
            value={filters.month}
            onChange={(e) => onFilterChange('month', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Month">Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

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

export default ResellerFilterBar;

