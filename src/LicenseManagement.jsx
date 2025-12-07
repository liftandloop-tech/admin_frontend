import React, { useState } from "react";
import { useSelector } from "react-redux";
import LicenseManagementSidebar from "./components/license-management-components/LicenseManagementSidebar";
import LicenseManagementHeader from "./components/license-management-components/LicenseManagementHeader";
import GenerateLicenseSection from "./components/license-management-components/GenerateLicenseSection";
import LicenseFilterBar from "./components/license-management-components/LicenseFilterBar";
import LicenseTable from "./components/license-management-components/LicenseTable";
import SuccessToast from "./components/common/SuccessToast";
import PermissionGate from "./components/common/PermissionGate";
import { PERMISSIONS } from "./utils/permissions";
import { selectRole } from "./features/auth/authSlice";
import { useGetPendingRequestsQuery } from "./store/api/endpoints/licenseApi";

/**
 * LicenseManagement Component - Main Entry File
 *
 * This is the License Management page that displays:
 * - Sidebar navigation with Licence Management active
 * - Header with title and subtitle
 * - Generate License section with form fields
 * - Filter bar with dropdown controls
 * - License management table with pagination
 *
 * Component Structure:
 * - LicenseManagementSidebar: Left navigation panel (fixed width)
 * - Main Content: Scrollable area with license management content
 *   - LicenseManagementHeader: Title and subtitle
 *   - GenerateLicenseSection: Form for generating new licenses
 *   - LicenseFilterBar: Filter controls (All Users, Status, Expiry)
 *   - LicenseTable: Table with license data and pagination
 *
 * Routing:
 * - Accessible at "/license-management" route
 *
 * Features:
 * - Generate new licenses with form inputs
 * - License key generation/refresh
 * - Activate/Deactivate toggle for each license
 * - View button for license details
 * - Pagination (3 entries per page)
 * - Filter functionality (ready for API integration)
 *
 * Features:
 * - License generation with API integration
 * - Dynamic data from backend APIs
 * - Loading and error states implemented
 * - Filter functionality connected to API
 */
const LicenseManagement = () => {
  const role = useSelector(selectRole);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [prefillData, setPrefillData] = useState(null); // For pre-filling form from table
  
  // Shared filter state
  const [filters, setFilters] = useState({
    allUsers: "All Users",
    status: "Status",
    expiry: "Expiry",
  });

  // Fetch pending requests for license table - only for super_admin
  // Resellers will see an empty list or we can create a reseller-specific endpoint later
  const { data: pendingRequestsData, isLoading, error, refetch } = useGetPendingRequestsQuery(undefined, {
    skip: role === 'reseller', // Skip for resellers as this is super-admin only
  });
  
  // Get pending count for badge
  // RTK Query transformResponse already returns the requests array, so handle both cases
  const pendingRequests = Array.isArray(pendingRequestsData) 
    ? pendingRequestsData 
    : (pendingRequestsData?.data?.requests || pendingRequestsData?.requests || []);
  const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;

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
      expiry: "Expiry",
    });
  };

  const triggerToast = (message) => {
    setToast({ show: true, message });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Handle Generate License from table
  const handleGenerateLicense = (data) => {
    setPrefillData(data);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('generate-license-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle form reset after successful generation
  const handleLicenseGenerated = () => {
    setPrefillData(null);
    // Only refetch if not a reseller (resellers don't have pending requests)
    if (role !== 'reseller') {
      refetch(); // Refresh pending requests
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <LicenseManagementSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <LicenseManagementHeader />
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-sm text-yellow-800">
                  <strong>{pendingCount}</strong> pending request{pendingCount !== 1 ? 's' : ''} waiting for license
                </span>
              </div>
            )}
          </div>
          
          {/* Generate License Section - Available for users with LICENSE_GENERATE permission (super_admin and reseller) */}
          {(role === 'super_admin' || role === 'reseller') && (
            <PermissionGate permission={PERMISSIONS.LICENSE_GENERATE}>
              <div id="generate-license-form">
                <GenerateLicenseSection 
                  onNotify={triggerToast} 
                  prefillData={prefillData}
                  onLicenseGenerated={handleLicenseGenerated}
                />
              </div>
            </PermissionGate>
          )}
          
          <LicenseFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          <div className="bg-white rounded-lg shadow-sm p-6">
            <LicenseTable 
              filters={filters} 
              pendingRequests={pendingRequestsData}
              isLoading={isLoading}
              error={error}
              onRefresh={refetch}
              onNotify={triggerToast}
              onGenerateLicense={handleGenerateLicense}
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

export default LicenseManagement;
