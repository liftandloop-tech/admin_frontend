import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ResellerManagementSidebar from "./components/reseller-management-components/ResellerManagementSidebar";
import ResellerManagementHeader from "./components/reseller-management-components/ResellerManagementHeader";
import ResellerDetailsSection from "./components/reseller-management-components/ResellerDetailsSection";
import ResellerFilterBar from "./components/reseller-management-components/ResellerFilterBar";
import ResellerTable from "./components/reseller-management-components/ResellerTable";
import SuccessToast from "./components/common/SuccessToast";
import { useGetAllResellersQuery } from "./store/api/endpoints/resellerApi";
import { selectIsAuthenticated } from "./features/auth/authSlice";

/**
 * ResellerManagement Component - Main Entry File
 *
 * This is the Reseller Management page that displays:
 * - Sidebar navigation with Reseller Management active
 * - Header with title and subtitle
 * - Reseller Details section with form fields
 * - Filter bar with dropdown controls
 * - Reseller management table with pagination
 *
 * Component Structure:
 * - ResellerManagementSidebar: Left navigation panel (fixed width)
 * - Main Content: Scrollable area with reseller management content
 *   - ResellerManagementHeader: Title and subtitle
 *   - ResellerDetailsSection: Form for adding/editing reseller information
 *   - ResellerFilterBar: Filter controls (Reseller Id, Status, Month)
 *   - ResellerTable: Table with reseller data and pagination
 *
 * Routing:
 * - Accessible at "/reseller-management" route
 *
 * Features:
 * - Add/Edit reseller information with form
 * - Activate/Deactivate toggle for each reseller
 * - View button for reseller details
 * - Pagination (3 entries per page)
 * - Filter functionality (ready for API integration)
 *
 * Features:
 * - Reseller CRUD operations with API integration
 * - Dynamic data from backend APIs
 * - Loading and error states implemented
 * - Filter functionality connected to API
 */
const ResellerManagement = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [editingReseller, setEditingReseller] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Shared filter state
  const [filters, setFilters] = useState({
    resellerId: "Reseller Id",
    status: "Status",
    month: "Month",
  });

  // Build query params
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    search: '',
    status: filters.status !== 'Status' ? filters.status.toLowerCase() : '',
  };

  // Fetch resellers
  const { data: resellersData, isLoading, error, refetch } = useGetAllResellersQuery(queryParams, {
    skip: !isAuthenticated, // Skip if not authenticated
  });

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
      resellerId: "Reseller Id",
      status: "Status",
      month: "Month",
    });
  };

  const triggerToast = (message) => {
    setToast({ show: true, message });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleEditComplete = () => {
    setEditingReseller(null);
    refetch();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <ResellerManagementSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <ResellerManagementHeader />
          <ResellerDetailsSection 
            onNotify={triggerToast} 
            editingReseller={editingReseller}
            onEditComplete={handleEditComplete}
          />
          <ResellerFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ResellerTable 
              filters={filters}
              resellersData={resellersData}
              isLoading={isLoading}
              error={error}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onEdit={setEditingReseller}
              onRefresh={refetch}
              onNotify={triggerToast}
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

export default ResellerManagement;
