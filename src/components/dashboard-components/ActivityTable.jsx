import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ActivityTable Component
 * 
 * Displays a table of recent user activity with pagination controls.
 * 
 * Features:
 * - Table with user activity data (User Id, Name, Business details, etc.)
 * - Action buttons: Activate and View for each row
 * - Pagination controls (Previous, page numbers, Next)
 * - Alternating row colors for better readability
 * 
 * Data Structure:
 * Each row contains: userId, userName, businessName, businessType, plan, startDate, endDate
 * 
 * State Management:
 * - currentPage: Tracks the current page number for pagination
 * 
 * Features:
 * - Displays activity data from API
 * - Client-side filtering and pagination
 * - Loading and error states handled
 * - Navigation to user details on view click
 */
const ActivityTable = ({ 
  filters = { allUsers: 'All Users', status: 'Status', newUser: 'New User' },
  activityData = [],
  isLoading = false,
  error = null
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  // Activation state - tracks which users are activated
  const [activatedUsers, setActivatedUsers] = useState(new Set());
  
  // Table configuration - Max 7 entries per page
  const entriesPerPage = 7;

  // Use API data only - show empty state if no data
  const tableData = activityData && Array.isArray(activityData) ? activityData : [];
  const dataToUse = tableData;

  // Filter data based on filter values
  const filteredData = useMemo(() => {
    let filtered = [...dataToUse];

    // Filter by status (if not default)
    if (filters.status && filters.status !== 'Status') {
      // For demo purposes, we'll filter based on activation status
      // In real app, this would come from API
      if (filters.status === 'Active') {
        filtered = filtered.filter(item => activatedUsers.has(item.userId));
      } else if (filters.status === 'Inactive') {
        filtered = filtered.filter(item => !activatedUsers.has(item.userId));
      }
    }

    // Filter by user type (if not default)
    if (filters.newUser && filters.newUser !== 'New User') {
      // For demo: Recent users are first 5, Old users are rest
      if (filters.newUser === 'Recent') {
        filtered = filtered.slice(0, 5);
      } else if (filters.newUser === 'Old User') {
        filtered = filtered.slice(5);
      }
    }

    return filtered;
  }, [dataToUse, filters, activatedUsers]);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate which entries to show for current page
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Toggle activation state for a user
  const handleActivate = (userId) => {
    setActivatedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
    // Note: This is a UI-only toggle for activity display
    // Actual status changes should be done via UserManagement page
  };

  // Check if a user is activated
  const isActivated = (userId) => {
    return activatedUsers.has(userId);
  };

  const handleView = (userId) => {
    navigate('/manage-user', { state: { userId } });
  };

  // Pagination handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Note: Pagination is handled client-side for activity data
      // Server-side pagination would require passing page to parent component
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading activity...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load recent activity. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Id</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Business Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Business Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Start Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.map((row, index) => {
              const activated = isActivated(row.userId);
              return (
                <tr 
                  key={row.userId} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}
                >
                  <td className="px-4 py-3 text-sm text-gray-800">{row.userId}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.businessName}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.businessType}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.plan}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.endDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActivate(row.userId)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                          activated
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {activated ? (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleView(row.userId)}
                        className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityTable;

