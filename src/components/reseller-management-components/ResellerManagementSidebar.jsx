import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, selectUser, selectRole } from '../../features/auth/authSlice';
import { useLogoutSuperAdminMutation, useLogoutResellerMutation } from '../../store/api/endpoints/authApi';
import PermissionGate from '../common/PermissionGate';
import { PERMISSIONS } from '../../utils/permissions';

/**
 * ResellerManagementSidebar Component
 * 
 * Sidebar navigation component for Reseller Management page.
 * Shows Reseller Management as active.
 * 
 * Features:
 * - Reseller Management highlighted as active
 * - Navigation links to other sections
 * - Profile section and logout button
 */
const ResellerManagementSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const [logoutSuperAdmin] = useLogoutSuperAdminMutation();
  const [logoutReseller] = useLogoutResellerMutation();

  // Handle logout
  const handleLogout = async () => {
    try {
      if (role === 'super_admin') {
        await logoutSuperAdmin().unwrap();
      } else if (role === 'reseller') {
        await logoutReseller().unwrap();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="w-64 bg-white h-screen flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-green-700 font-semibold text-lg">QuickXPos</span>
        </Link>
      </div>

      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-6 mb-4">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Menu</span>
        </div>
        
        <nav className="px-4">
          {/* Dashboard */}
          <div className="mb-1">
            <Link to="/dashboard">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                isActive('/dashboard') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}>
                <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1 h-1 bg-white rounded-sm"></div>
                    <div className="w-1 h-1 bg-white rounded-sm"></div>
                    <div className="w-1 h-1 bg-white rounded-sm"></div>
                    <div className="w-1 h-1 bg-white rounded-sm"></div>
                  </div>
                </div>
                <span className="text-gray-700 font-medium text-sm">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* User Management */}
          <div className="mb-1">
            <Link to="/user-management">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                isActive('/user-management') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}>
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-700 font-medium text-sm">User Management</span>
              </div>
            </Link>
          </div>

          {/* Licence Management - For super_admin and resellers */}
          <PermissionGate anyPermission={[PERMISSIONS.LICENSE_GENERATE, PERMISSIONS.LICENSE_VIEW]}>
            <div className="mb-1">
              <Link to="/license-management">
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  isActive('/license-management') ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}>
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-gray-700 font-medium text-sm">Licence Management</span>
                </div>
              </Link>
            </div>
          </PermissionGate>

          {/* Reseller Management - Active */}
          <div className="mb-1">
            <Link to="/reseller-management">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                isActive('/reseller-management') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}>
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-700 font-medium text-sm">Reseller Management</span>
              </div>
            </Link>
          </div>

          {/* Profile */}
          <div className="mb-1">
            <Link to="/profile">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                isActive('/profile') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}>
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700 font-medium text-sm">Profile</span>
              </div>
            </Link>
          </div>
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4 mx-6"></div>

        {/* Profile Section */}
        <div className="px-6 mb-4">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Profile</span>
        </div>
        
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-medium text-sm">{user?.name || "User"}</p>
              <p className="text-gray-400 text-xs">{user?.email || "No email"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="p-6 border-t border-gray-100">
        <button 
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={handleLogout}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-gray-700 font-medium text-sm">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default ResellerManagementSidebar;

