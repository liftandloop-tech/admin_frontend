import React from 'react';

/**
 * ResellerManagementHeader Component
 * 
 * Header section for Reseller Management page with:
 * - Page title: "Reseller Management"
 * - Subtitle describing the page purpose
 */
const ResellerManagementHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Reseller Management</h1>
      <p className="text-gray-600 text-sm">
        Manage and organize all POS business types within Quick X POS.
      </p>
    </div>
  );
};

export default ResellerManagementHeader;

