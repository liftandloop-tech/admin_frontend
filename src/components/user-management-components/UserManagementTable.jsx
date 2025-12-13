import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUpdateSalonMutation, useUpdateResellerSalonMutation } from "../../store/api/endpoints/userManagementApi";
import { selectRole } from "../../features/auth/authSlice";

/**
 * UserManagementTable Component
 * 
 * Displays user management table with:
 * - User data columns: User Id, User Name, Business Name, Business Type, Plan, Start Date, Reseller Id, Action
 * - Activate/Deactivate toggle functionality
 * - View button for each user
 * - Pagination (3 entries per page as per image)
 * 
 * Features:
 * - Toggle activation state for each user
 * - Pagination controls
 * - Alternating row colors
 */
const UserManagementTable = ({
  filters = {
    allUsers: "All Users",
    status: "Status",
    allResellers: "All Resellers",
  },
  onViewUser,
  salonsData = null,
  isLoading = false,
  error = null,
  currentPage: externalCurrentPage = 1,
  onPageChange: externalOnPageChange = null,
  onNotify = null,
  onRefresh = null,
}) => {
  // Use external pagination if provided, otherwise use internal state
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const currentPage = externalOnPageChange ? externalCurrentPage : internalCurrentPage;
  const setCurrentPage = externalOnPageChange || setInternalCurrentPage;
  
  const entriesPerPage = 10;
  
  // Transform API data to match table format
  const apiData = salonsData?.salons || [];
  const tableData = apiData.map((salon) => ({
    userId: salon._id?.slice(-6) || salon.id?.slice(-6) || 'N/A',
    userName: salon.ownerName || 'N/A',
    businessName: salon.salonName || 'N/A',
    businessType: salon.businessCategory || 'Salon',
    plan: salon.plan || 'N/A',
    startDate: salon.createdAt ? new Date(salon.createdAt).toLocaleDateString('en-GB') : 'N/A',
    resellerId: salon.resellerId || 'N/A',
    resellerLabel: salon.resellerName || salon.resellerId || 'N/A',
    status: salon.status === 'suspended' ? 'Suspended' : 
            salon.status === 'active' ? 'Active' : 
            salon.status === 'pending' ? 'Pending' : 'Pending',
    _id: salon._id || salon.id,
  }));

  // Use API data only - show empty state if no data
  const dataToUse = tableData;
  
  const [userStatus, setUserStatus] = useState(() => {
    if (dataToUse.length === 0) return {};
    return dataToUse.reduce((acc, user) => {
      acc[user.userId] = user.status;
      return acc;
    }, {});
  });

  const getStatus = (userId) => userStatus[userId] || "Pending";

  const filteredData = useMemo(() => {
    const normaliseAllUsers = (value) =>
      value.replace(" Users", "").trim();

    const matchesAllUsers = (row) => {
      if (!filters.allUsers || filters.allUsers === "All Users") return true;
      return getStatus(row.userId) === normaliseAllUsers(filters.allUsers);
    };

    const matchesStatus = (row) => {
      if (!filters.status || filters.status === "Status") return true;
      return getStatus(row.userId) === filters.status;
    };

    const matchesReseller = (row) => {
      if (!filters.allResellers || filters.allResellers === "All Resellers") {
        return true;
      }
      return row.resellerLabel === filters.allResellers;
    };

    return dataToUse.filter(
      (row) => matchesAllUsers(row) && matchesStatus(row) && matchesReseller(row)
    );
  }, [filters, userStatus, dataToUse]);

  const filteredEntries = filteredData.length;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate which entries to show for current page
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;

  // API mutation for updating salon status - use different endpoints based on role
  const role = useSelector(selectRole);
  const [updateSalon, { isLoading: isTogglingSuperAdmin }] = useUpdateSalonMutation();
  const [updateResellerSalon, { isLoading: isTogglingReseller }] = useUpdateResellerSalonMutation();
  const isToggling = role === 'reseller' ? isTogglingReseller : isTogglingSuperAdmin;

  // Toggle activation state for a user
  const handleActivate = async (userId) => {
    // Find the salon ID from the table data
    const salon = dataToUse.find((row) => row.userId === userId);
    if (!salon || !salon._id) {
      onNotify?.("User not found");
      return;
    }

    const currentStatus = getStatus(userId);
    // Toggle between "active" and "suspended" (not "inactive")
    const newStatus = currentStatus === "Active" ? "suspended" : "active";
    const displayStatus = newStatus === "active" ? "Active" : "Suspended";

    try {
      // Use appropriate update function based on role
      if (role === 'reseller') {
        await updateResellerSalon({ 
          id: salon._id, 
          status: newStatus 
        }).unwrap();
      } else {
        await updateSalon({ 
          id: salon._id, 
          status: newStatus 
        }).unwrap();
      }
      
      // Update local state on success
      setUserStatus((prev) => {
        const nextState = { ...prev };
        nextState[userId] = displayStatus;
        return nextState;
      });
      
      onNotify?.(`User ${newStatus === "active" ? "activated" : "suspended"} successfully`);
      onRefresh?.(); // Refresh data if callback provided
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to update user status";
      onNotify?.(errorMessage);
      console.error("Failed to toggle salon status:", error);
    }
  };

  // Check if a user is activated
  const isActivated = (userId) => {
    const status = getStatus(userId);
    return status === "Active" || status === "active";
  };

  // Handle view button click
  const handleView = (row) => {
    if (onViewUser && row._id) {
      onViewUser(row._id);
    }
  };

  // Pagination handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          {error?.data?.message || error?.message || 'Failed to load users. Please try again later.'}
        </p>
      </div>
    );
  }

  // Use pagination from API if available
  const pagination = salonsData?.pagination;
  const calculatedTotalPages = Math.ceil(filteredEntries / entriesPerPage) || 1;
  const totalPages = pagination?.totalPages || calculatedTotalPages;
  const totalEntries = pagination?.totalRecords || filteredEntries;
  const currentPageData = pagination ? dataToUse : filteredData.slice(startIndex, endIndex);

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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reseller Id</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              currentPageData.map((row, index) => {
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
                  <td className="px-4 py-3 text-sm text-gray-800">{row.resellerId}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActivate(row.userId)}
                        disabled={isToggling}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                          activated
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {activated ? (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Deactivate</span>
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
                        onClick={() => handleView(row)}
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
            }))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {pagination ? (
            `Showing ${((currentPage - 1) * entriesPerPage) + 1} to ${Math.min(currentPage * entriesPerPage, totalEntries)} of ${totalEntries} entries`
          ) : (
            `Showing ${Math.min(endIndex, filteredEntries)} of ${filteredEntries} entries`
          )}
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
          {/* Show page numbers */}
          {totalPages > 0 && (
            <>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
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
            </>
          )}
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

export default UserManagementTable;

