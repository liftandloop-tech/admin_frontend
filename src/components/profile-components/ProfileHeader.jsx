import React from 'react';

/**
 * ProfileHeader Component
 * 
 * Header section for Profile page with:
 * - Page title: "Profile"
 * - Subtitle describing the page purpose
 */
const ProfileHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Profile</h1>
      <p className="text-gray-600 text-sm">
        Manage and organize all POS business types within Quick X POS.
      </p>
    </div>
  );
};

export default ProfileHeader;

