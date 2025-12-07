import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllSalonsQuery, useGetResellerSalonsQuery } from '../../store/api/endpoints/userManagementApi';
import { selectIsAuthenticated, selectRole } from '../../features/auth/authSlice';
import FilterBar from './FilterBar';
import ActivityTable from './ActivityTable';

/**
 * RecentActivity Component
 * 
 * Container component that combines the filter bar and activity table.
 * 
 * Structure:
 * - FilterBar: Filter controls at the top
 * - ActivityTable: Data table with pagination at the bottom
 * 
 * This component manages shared state between filters and table to enable
 * filtering functionality.
 */
const RecentActivity = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  
  // Use different endpoints based on role
  const {
    data: superAdminSalonsData,
    isLoading: isLoadingSuperAdmin,
    error: superAdminError,
  } = useGetAllSalonsQuery(
    {
      page: 1,
      limit: 20,
      search: '',
      status: '',
      resellerId: '',
    },
    {
      skip: !isAuthenticated || role !== 'super_admin',
    }
  );

  const {
    data: resellerSalonsData,
    isLoading: isLoadingReseller,
    error: resellerError,
  } = useGetResellerSalonsQuery(
    {
      page: 1,
      limit: 20,
      search: '',
      status: '',
    },
    {
      skip: !isAuthenticated || role !== 'reseller',
    }
  );

  // Use appropriate data based on role
  const salonsData = role === 'reseller' ? resellerSalonsData : superAdminSalonsData;
  const isLoading = role === 'reseller' ? isLoadingReseller : isLoadingSuperAdmin;
  const error = role === 'reseller' ? resellerError : superAdminError;

  // Map salons data to the structure expected by ActivityTable
  const activityData =
    salonsData?.salons?.map((salon) => ({
      userId: salon._id?.slice(-6) || salon.id?.slice(-6) || 'N/A',
      userName: salon.ownerName || 'N/A',
      businessName: salon.salonName || 'N/A',
      businessType: salon.businessCategory || 'Salon',
      plan: salon.plan || 'N/A',
      startDate: salon.createdAt
        ? new Date(salon.createdAt).toLocaleDateString('en-GB')
        : 'N/A',
      endDate: salon.expiryDate
        ? new Date(salon.expiryDate).toLocaleDateString('en-GB')
        : '-',
    })) || [];

  // Shared filter state
  const [filters, setFilters] = useState({
    allUsers: 'All Users',
    status: 'Status',
    newUser: 'New User'
  });

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({
      allUsers: 'All Users',
      status: 'Status',
      newUser: 'New User'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />
      <ActivityTable
        filters={filters}
        activityData={activityData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default RecentActivity;

