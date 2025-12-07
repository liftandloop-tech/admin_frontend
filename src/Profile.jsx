import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProfileSidebar from "./components/profile-components/ProfileSidebar";
import ProfileHeader from "./components/profile-components/ProfileHeader";
import CredentialForm from "./components/profile-components/CredentialForm";
import SuccessToast from "./components/common/SuccessToast";
import { 
  useGetSuperAdminProfileQuery,
  useGetResellerProfileQuery,
  useUpdateResellerProfileMutation 
} from "./store/api/endpoints/authApi";
import { selectRole } from "./features/auth/authSlice";

/**
 * Profile Component - Main Entry File
 *
 * This is the Profile page that displays:
 * - Sidebar navigation with Profile active
 * - Header with title and subtitle
 * - Credential form section with profile fields
 * - Submit button
 *
 * Component Structure:
 * - ProfileSidebar: Left navigation panel (fixed width)
 * - Main Content: Scrollable area with profile content
 *   - ProfileHeader: Title and subtitle
 *   - CredentialForm: Form with profile fields
 *   - Submit button positioned outside the form card
 *
 * Routing:
 * - Accessible at "/profile" route
 *
 * Features:
 * - Edit profile information with form
 * - Password visibility toggle
 * - Password generation functionality
 * - Working form submission
 */
const Profile = () => {
  const role = useSelector(selectRole);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Fetch profile data based on role
  const { data: superAdminData, isLoading: isLoadingSuperAdmin } = useGetSuperAdminProfileQuery(undefined, {
    skip: role !== 'super_admin',
  });
  
  const { data: resellerData, isLoading: isLoadingReseller } = useGetResellerProfileQuery(undefined, {
    skip: role !== 'reseller',
  });

  const [updateResellerProfile, { isLoading: isUpdating }] = useUpdateResellerProfileMutation();

  // Determine which data to use
  const profileData = role === 'super_admin' ? superAdminData : resellerData;
  const isLoading = role === 'super_admin' ? isLoadingSuperAdmin : isLoadingReseller;

  // Shared form state
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
    email: "",
    userName: "",
    contact: "",
    city: "",
  });

  // Populate form when profile data loads
  useEffect(() => {
    if (profileData) {
      const user = profileData.user || profileData.reseller || profileData.superAdmin;
      if (user) {
        setFormData({
          adminId: user.adminId || user.resellerId || user._id?.slice(-6) || "",
          password: "", // Don't populate password
          email: user.email || "",
          userName: user.name || user.userName || "",
          contact: user.contact || "",
          city: user.city || "",
        });
      }
    }
  }, [profileData]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.email || !formData.userName) {
      setToast({ show: true, message: "Please fill in all required fields" });
      return;
    }

    try {
      if (role === 'reseller') {
        const updateData = {
          name: formData.userName,
          email: formData.email,
          contact: formData.contact,
          city: formData.city,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateResellerProfile(updateData).unwrap();
        setToast({ show: true, message: "Profile updated successfully!" });
      } else {
        // Super Admin profile update would go here when backend endpoint is available
        setToast({ show: true, message: "Super Admin profile update not yet implemented" });
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to update profile";
      setToast({ show: true, message: errorMessage });
    }
  };

  // Handle form data changes from CredentialForm
  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <ProfileSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <ProfileHeader />
            <CredentialForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />

            {/* Submit Button - Positioned outside the form card */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Save</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
