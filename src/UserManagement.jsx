import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserManagementSidebar from "./components/user-management-components/UserManagementSidebar";
import UserManagementHeader from "./components/user-management-components/UserManagementHeader";
import UserManagementFilterBar from "./components/user-management-components/UserManagementFilterBar";
import UserManagementTable from "./components/user-management-components/UserManagementTable";
import SuccessToast from "./components/common/SuccessToast";
import { useGetAllSalonsQuery, useGetResellerSalonsQuery } from "./store/api/endpoints/userManagementApi";
import { selectRole } from "./features/auth/authSlice";

/**
 * UserManagement Component - Main Entry File
 *
 * This is the User Management page that displays:
 * - Sidebar navigation with User Management active
 * - Header with title, subtitle, and Add User button
 * - Filter bar with dropdown controls
 * - User management table with pagination
 *
 * Component Structure:
 * - UserManagementSidebar: Left navigation panel (fixed width)
 * - Main Content: Scrollable area with user management content
 *   - UserManagementHeader: Title, subtitle, and Add User button
 *   - UserManagementFilterBar: Filter controls (All Users, Status, All Resellers)
 *   - UserManagementTable: Table with user data and pagination
 *
 * Routing:
 * - Accessible at "/user-management" route
 *
 * Features:
 * - Activate/Suspend toggle for each user
 * - View button for user details
 * - Pagination (3 entries per page)
 * - Working filter functionality
 */
const UserManagement = () => {
  const navigate = useNavigate();
  const role = useSelector(selectRole);
  const [toast, setToast] = useState({ show: false, message: "" });
  
  // Shared filter state
  const [filters, setFilters] = useState({
    allUsers: "All Users",
    status: "Status",
    allResellers: "All Resellers",
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Build query params from filters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    search: '',
    status: filters.status !== 'Status' ? filters.status.toLowerCase() : '',
    resellerId: filters.allResellers !== 'All Resellers' ? filters.allResellers : '',
  };

  const resellerQueryParams = {
    page: currentPage,
    limit: pageSize,
    search: '',
    status: filters.status !== 'Status' ? filters.status.toLowerCase() : '',
  };

  // Fetch salons data - use different endpoints based on role
  const { 
    data: superAdminSalonsData, 
    isLoading: isLoadingSuperAdmin, 
    error: superAdminError,
    refetch: refetchSuperAdmin 
  } = useGetAllSalonsQuery(queryParams, {
    skip: role === 'reseller',
  });

  const { 
    data: resellerSalonsData, 
    isLoading: isLoadingReseller, 
    error: resellerError,
    refetch: refetchReseller 
  } = useGetResellerSalonsQuery(resellerQueryParams, {
    skip: role !== 'reseller',
  });

  // Use appropriate data based on role
  const salonsData = role === 'reseller' ? resellerSalonsData : superAdminSalonsData;
  const isLoading = role === 'reseller' ? isLoadingReseller : isLoadingSuperAdmin;
  const error = role === 'reseller' ? resellerError : superAdminError;
  const refetch = role === 'reseller' ? refetchReseller : refetchSuperAdmin;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({
      allUsers: "All Users",
      status: "Status",
      allResellers: "All Resellers",
    });
  };

  const handleNavigateToManageUser = (userId = null) => {
    if (userId) {
      navigate(`/manage-user/${userId}`);
    } else {
      navigate("/manage-user");
    }
  };

  const triggerToast = (message) => {
    setToast({ show: true, message });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <UserManagementSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <UserManagementHeader onAddUser={handleNavigateToManageUser} />
          <UserManagementFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          <div className="bg-white rounded-lg shadow-sm p-6">
            <UserManagementTable
              filters={filters}
              onViewUser={handleNavigateToManageUser}
              salonsData={salonsData}
              isLoading={isLoading}
              error={error}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onNotify={triggerToast}
              onRefresh={refetch}
            />
          </div>
        </div>
      </div>
      <SuccessToast
        show={toast.show}
        message={toast.message}
        onClose={handleToastClose}
      />
    </div>
  );
};

export default UserManagement;
