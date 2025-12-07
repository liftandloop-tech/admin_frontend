import React, { useState, useMemo, useEffect } from "react";
import { useToggleResellerStatusMutation, useDeleteResellerMutation } from "../../store/api/endpoints/resellerApi";

const ResellerTable = ({
  filters = { resellerId: "Reseller Id", status: "Status", month: "Month" },
  resellersData = null,
  isLoading = false,
  error = null,
  currentPage: externalCurrentPage = 1,
  onPageChange: externalOnPageChange = null,
  onEdit = null,
  onRefresh = null,
  onNotify = null,
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading resellers...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Failed to load resellers. Please try again.</p>
      </div>
    );
  }
  // Use external pagination if provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const currentPage = externalOnPageChange ? externalCurrentPage : internalCurrentPage;
  const setCurrentPage = externalOnPageChange || setInternalCurrentPage;
  
  const entriesPerPage = 10;
  
  const [toggleStatus, { isLoading: isToggling }] = useToggleResellerStatusMutation();
  const [deleteReseller, { isLoading: isDeleting }] = useDeleteResellerMutation();

  // Transform API data
  const apiTableData = resellersData?.resellers || [];
  const tableData = apiTableData.map((reseller) => {
    // Get first assigned salon if any
    const firstSalon = reseller.assignedSalons?.[0] || {};
    return {
      resellerId: reseller.resellerId || 'N/A',
      userId: firstSalon._id?.slice(-6) || 'N/A',
      userName: firstSalon.ownerName || reseller.name || 'N/A',
      businessName: firstSalon.salonName || 'N/A',
      businessType: firstSalon.businessCategory || 'N/A',
      plan: 'N/A', // Would need to get from license
      startDate: reseller.createdAt ? new Date(reseller.createdAt).toLocaleDateString('en-GB') : 'N/A',
      expiryDate: 'N/A',
      month: reseller.createdAt ? new Date(reseller.createdAt).toLocaleDateString('en-US', { month: 'long' }) : 'N/A',
      status: reseller.status || 'inactive',
      _id: reseller._id || reseller.id,
    };
  });

  // Use API data only - show empty state if no data
  const dataToUse = tableData;
  
  const [resellerStatus, setResellerStatus] = useState(() => {
    if (dataToUse.length === 0) return {};
    return dataToUse.reduce((acc, row) => {
      acc[row.resellerId] = row.status;
      return acc;
    }, {});
  });

  const getStatus = (resellerId) => resellerStatus[resellerId] || "Inactive";

  const filteredData = useMemo(() => {
    return dataToUse.filter((row) => {
      const matchesReseller =
        !filters.resellerId || filters.resellerId === "Reseller Id"
          ? true
          : row.resellerId === filters.resellerId;

      const matchesStatus =
        !filters.status || filters.status === "Status"
          ? true
          : getStatus(row.resellerId) === filters.status;

      const matchesMonth =
        !filters.month || filters.month === "Month"
          ? true
          : row.month === filters.month;

      return matchesReseller && matchesStatus && matchesMonth;
    });
  }, [filters, resellerStatus]);

  const filteredEntries = filteredData.length;
  const totalPages = Math.ceil(filteredEntries / entriesPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const handleActivate = async (resellerId) => {
    const reseller = dataToUse.find(r => r.resellerId === resellerId);
    if (!reseller || !reseller._id) return;

    try {
      await toggleStatus({ id: reseller._id }).unwrap();
      // Update local state optimistically
      const newStatus = getStatus(resellerId) === "Active" ? "Inactive" : "Active";
      setResellerStatus((prev) => {
        const nextState = { ...prev };
        nextState[resellerId] = newStatus;
        return nextState;
      });
      onNotify?.(`Reseller ${newStatus === "Active" ? "activated" : "deactivated"} successfully`);
      if (onRefresh) onRefresh();
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to toggle reseller status";
      onNotify?.(errorMessage);
      console.error("Failed to toggle reseller status:", error);
    }
  };

  const isActivated = (resellerId) => getStatus(resellerId) === "Active";

  const handleView = (resellerId) => {
    const reseller = dataToUse.find(r => r.resellerId === resellerId);
    if (reseller && reseller._id && onEdit) {
      onEdit(reseller);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User Id
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Business Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.map((row, index) => {
              const activated = isActivated(row.resellerId);
              return (
                <tr
                  key={`${row.resellerId}-${row.userId}-${index}`}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 hover:bg-gray-100 transition-colors"
                  }
                >
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.userId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.userName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.businessName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.businessType}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.plan}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.startDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.expiryDate}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {getStatus(row.resellerId)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActivate(row.resellerId)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                          activated
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {activated ? (
                          <>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResellerTable;
