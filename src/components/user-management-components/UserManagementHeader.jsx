import React from "react";

/**
 * UserManagementHeader Component
 *
 * Header section with configurable title, description and optional action button.
 */
const UserManagementHeader = ({
  title = "User Management",
  description = "Manage and organize all POS business types within Quick X POS.",
  actionLabel = "Add User",
  showAction = true,
  onAddUser,
}) => {
  const handleAddUser = () => {
    if (showAction && onAddUser) {
      onAddUser();
    }
  };

  return (
    <div className="mb-6 flex items-start justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      {showAction && (
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default UserManagementHeader;

