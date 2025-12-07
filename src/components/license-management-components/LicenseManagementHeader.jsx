import React from 'react';

/**
 * LicenseManagementHeader Component
 * 
 * Header section for License Management page with:
 * - Page title: "Licence Management"
 * - Subtitle describing the page purpose
 */
const LicenseManagementHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Licence Management</h1>
      <p className="text-gray-600 text-sm">
        Manage and organize all POS business types within Quick X POS.
      </p>
    </div>
  );
};

export default LicenseManagementHeader;

