import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useApproveRequestMutation, useRejectRequestMutation } from '../../store/api/endpoints/licenseApi';
import { hasPermission } from '../../utils/permissions';
import { PERMISSIONS } from '../../utils/permissions';
import { selectRole } from '../../features/auth/authSlice';

/**
 * LicenseTable Component
 * 
 * Displays license management table with:
 * - License data columns: User Id, User Name, Business Name, Business Type, Plan, Start Date, Expiry Date, Action
 * - Activate button for each license
 * - View button for each license
 * - Pagination (3 entries per page as per image)
 * 
 * Features:
 * - Toggle activation state for each license
 * - Pagination controls
 * - Alternating row colors
 */
const LicenseTable = ({ 
  filters = { allUsers: 'All Users', status: 'Status', expiry: 'Expiry' },
  pendingRequests = [],
  isLoading = false,
  error = null,
  onRefresh = null,
  onNotify = null,
  onGenerateLicense = null, // New prop for generating license
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get permissions and role from Redux store
  const permissions = useSelector((state) => state.auth.permissions);
  const userRole = useSelector(selectRole);
  const canGenerateLicense = hasPermission(permissions, PERMISSIONS.LICENSE_GENERATE, userRole);
  const canApproveReject = hasPermission(permissions, PERMISSIONS.LICENSE_APPROVE_REJECT, userRole);
  
  // Mutations for approve/reject
  const [approveRequest, { isLoading: isApproving }] = useApproveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();
  
  const navigate = useNavigate();
  
  // Table configuration - 3 entries per page as shown in image
  const entriesPerPage = 3;

  // Debug: Log the received data structure
  // console.log('Pending requests data:', pendingRequests);
  
  // Transform API data to table format
  // Handle both array and object with requests property
  const requestsArray = Array.isArray(pendingRequests) 
    ? pendingRequests 
    : (pendingRequests?.requests && Array.isArray(pendingRequests.requests))
      ? pendingRequests.requests
      : [];
  
  const apiTableData = requestsArray.map((request) => {
    const salon = request.salon || {};
    const license = request.license || {};
    
    // Extract user ID - use last 6 characters of salon ID if available
    let userId = 'N/A';
    if (salon._id) {
      const idStr = typeof salon._id === 'string' ? salon._id : salon._id.toString();
      userId = idStr.length >= 6 ? idStr.slice(-6) : idStr;
    } else if (request._id) {
      const idStr = typeof request._id === 'string' ? request._id : request._id.toString();
      userId = idStr.length >= 6 ? idStr.slice(-6) : idStr;
    }
    
    return {
      userId: userId,
      userName: salon.ownerName || 'N/A',
      businessName: salon.salonName || 'N/A',
      businessType: salon.businessCategory || 'Salon',
      plan: request.durationDays ? `${Math.floor(request.durationDays / 30)} Months` : 'N/A',
      startDate: request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-GB') : 'N/A',
      expiryDate: license && license.expiryDate ? new Date(license.expiryDate).toLocaleDateString('en-GB') : 'N/A',
      requestId: request._id || request.id,
      salonId: salon._id || request._id || request.id,
      licenseToken: salon.licenseToken || request.licenseToken || 'N/A', // Add license token
      status: request.status || 'pending',
    };
  });

  // Use API data only - show empty state if no data
  const tableData = apiTableData;

  // Filter data based on filter values
  const filteredData = useMemo(() => {
    let filtered = [...tableData];

    // Filter by status (if not default)
    if (filters.status && filters.status !== 'Status') {
      if (filters.status === 'Active') {
        filtered = filtered.filter(item => item.status === 'approved' || item.status === 'active');
      } else if (filters.status === 'Inactive') {
        filtered = filtered.filter(item => item.status === 'rejected' || item.status === 'inactive');
      } else if (filters.status === 'Pending') {
        filtered = filtered.filter(item => item.status === 'pending');
      }
    }

    // Filter by expiry (if not default)
    if (filters.expiry && filters.expiry !== 'Expiry') {
      const today = new Date();
      if (filters.expiry === 'Expired') {
        filtered = filtered.filter(item => {
          const expiryDate = new Date(item.expiryDate.split('-').reverse().join('-'));
          return expiryDate < today;
        });
      } else if (filters.expiry === 'Valid') {
        filtered = filtered.filter(item => {
          const expiryDate = new Date(item.expiryDate.split('-').reverse().join('-'));
          return expiryDate >= today;
        });
      }
    }

    return filtered;
  }, [tableData, filters]);

  const filteredEntries = filteredData.length;
  const totalPages = Math.ceil(filteredEntries / entriesPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate which entries to show for current page
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Handle approve request
  const handleApprove = async (requestId) => {
    try {
      await approveRequest(requestId).unwrap();
      onNotify?.('License request approved successfully');
      onRefresh?.();
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to approve request';
      onNotify?.(errorMessage);
      console.error('Failed to approve request:', error);
    }
  };

  // Handle reject request
  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId).unwrap();
      onNotify?.('License request rejected successfully');
      onRefresh?.();
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to reject request';
      onNotify?.(errorMessage);
      console.error('Failed to reject request:', error);
    }
  };

  // Handle view button click
  const handleView = (userId) => {
    navigate('/manage-user');
  };

  // Handle Generate License button
  const handleGenerateLicense = (row) => {
    if (onGenerateLicense) {
      onGenerateLicense({
        salonId: row.salonId,
        licenseToken: row.licenseToken,
        salonName: row.businessName,
        ownerName: row.userName,
      });
    }
  };

  // Pagination handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading licenses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          {error?.data?.message || error?.message || 'Failed to load licenses. Please try again later.'}
        </p>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">License Token</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Business Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Start Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Expiry Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                  No pending license requests found
                </td>
              </tr>
            ) : (
              currentPageData.map((row, index) => {
              const isPending = row.status === 'pending';
              return (
                <tr 
                  key={row.requestId || row.salonId || `row-${index}`} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}
                >
                  <td className="px-4 py-3 text-sm text-gray-800">{row.userId}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.businessName}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {row.licenseToken !== 'N/A' ? row.licenseToken.substring(0, 20) + '...' : 'N/A'}
                      </span>
                      {row.licenseToken !== 'N/A' && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(row.licenseToken);
                            onNotify?.("License token copied to clipboard");
                          }}
                          className="text-blue-600 hover:text-blue-700"
                          title="Copy license token"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.businessType}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.plan}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{row.expiryDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {isPending && row.requestId ? (
                        <>
                          {/* Generate button - Only for super-admin with LICENSE_GENERATE permission */}
                          {canGenerateLicense && (
                            <button
                              onClick={() => handleGenerateLicense(row)}
                              className="flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors bg-blue-600 text-white hover:bg-blue-700"
                              title="Generate License"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Generate</span>
                            </button>
                          )}
                          {/* Approve/Reject buttons - Only for super-admin with LICENSE_APPROVE_REJECT permission */}
                          {canApproveReject && (
                            <>
                              <button
                                onClick={() => handleApprove(row.requestId)}
                                disabled={isApproving || isRejecting}
                                className="flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReject(row.requestId)}
                                disabled={isApproving || isRejecting}
                                className="flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {/* For resellers (view-only), show status text */}
                          {!canGenerateLicense && !canApproveReject && (
                            <span className="text-xs text-gray-500">
                              {row.status === 'approved' ? 'Approved' : row.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {row.status === 'approved' ? 'Approved' : row.status === 'rejected' ? 'Rejected' : 'N/A'}
                        </span>
                      )}
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
            }))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {Math.min(endIndex, filteredEntries)} of {filteredEntries} entries
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
          {/* Show page numbers - display first 2 pages as shown in image */}
          {totalPages > 0 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                1
              </button>
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(2)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    currentPage === 2
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  2
                </button>
              )}
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

export default LicenseTable;

