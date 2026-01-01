import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/manage-user-components/Sidebar";
import UserManagementHeader from "./components/user-management-components/UserManagementHeader";
import UserFormCard from "./components/manage-user-components/UserFormCard";
import SuccessToast from "./components/common/SuccessToast";
import {
  useCreateSalonMutation,
  useUpdateSalonMutation,
  useUpdateResellerSalonMutation,
  useGetSalonDetailQuery,
  useGetResellerSalonDetailQuery
} from "./store/api/endpoints/userManagementApi";
import { useGetBusinessCategoriesQuery } from "./store/api/endpoints/businessCategoryApi";
import { useGetSubscriptionPlansQuery } from "./store/api/endpoints/subscriptionApi";
import { selectRole } from "./features/auth/authSlice";
import { isValidEmail, isValidPhoneNumber, normalizePhoneNumber, formatPhoneInput } from "./utils/validation";

const ManageUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const role = useSelector(selectRole);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    // Required fields matching Salon schema
    salonName: "",
    salonAddress: "",
    licenseToken: "",
    licenseKey: "",
    ownerName: "",
    gstin: "",
    email: "",
    MobileNumber: "",
    password: "",
    businessCategory: "",
    // Optional fields from Salon schema
    gender: "",
    dateOfBirth: "",
  });

  const [toast, setToast] = useState({ show: false, message: "" });

  // API hooks - use different endpoints based on role
  const [createSalon, { isLoading: isCreating }] = useCreateSalonMutation();
  const [updateSalon, { isLoading: isUpdatingSuperAdmin }] = useUpdateSalonMutation();
  const [updateResellerSalon, { isLoading: isUpdatingReseller }] = useUpdateResellerSalonMutation();

  // Fetch salon data if editing - use different endpoints based on role
  const { data: superAdminSalonData, isLoading: isLoadingSuperAdmin } = useGetSalonDetailQuery(id, {
    skip: !isEditMode || role === 'reseller',
  });

  const { data: resellerSalonData, isLoading: isLoadingReseller } = useGetResellerSalonDetailQuery(id, {
    skip: !isEditMode || role !== 'reseller',
  });

  // Use appropriate data based on role
  const salonData = role === 'reseller' ? resellerSalonData : superAdminSalonData;
  const isLoadingSalon = role === 'reseller' ? isLoadingReseller : isLoadingSuperAdmin;
  const isUpdating = role === 'reseller' ? isUpdatingReseller : isUpdatingSuperAdmin;

  // Fetch business categories and subscription plans for dropdowns
  // Skip these queries for resellers as they're super-admin only endpoints
  // Resellers typically only edit existing salons, not create new ones
  const { data: categoriesData } = useGetBusinessCategoriesQuery(
    { page: 1, limit: 100 },
    { skip: role === 'reseller' }
  );
  const { data: plansData } = useGetSubscriptionPlansQuery(
    { page: 1, limit: 100 },
    { skip: role === 'reseller' }
  );

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && salonData) {
      const salon = salonData;
      // Normalize phone number for display (remove +91 prefix if present)
      const displayMobileNumber = salon.MobileNumber || salon.mobileNumber || "";
      setFormData({
        salonName: salon.salonName || "",
        salonAddress: salon.salonAddress || "",
        licenseToken: salon.licenseToken || "",
        licenseKey: salon.license?.licenseKey || "", // Populate license key
        ownerName: salon.ownerName || "",
        gstin: salon.gstin || "",
        email: salon.email || "",
        MobileNumber: normalizePhoneNumber(displayMobileNumber),
        password: "", // Don't populate password
        businessCategory: salon.businessCategory || "",
        gender: salon.gender || "",
        dateOfBirth: salon.dateOfBirth ? new Date(salon.dateOfBirth).toISOString().split('T')[0] : "",
      });
    }
  }, [isEditMode, salonData]);

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    // Format phone number input if it's MobileNumber field
    if (field === 'MobileNumber') {
      value = formatPhoneInput(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const triggerToast = (message) => {
    setToast({ show: true, message });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleGenerateLicenseToken = () => {
    const randomChunk = Math.random().toString(16).slice(2, 10).toUpperCase();
    const categoryPrefix = formData.businessCategory ? formData.businessCategory.substring(0, 3).toUpperCase() : 'QXP';
    setFormData((prev) => ({
      ...prev,
      licenseToken: `QXP-${categoryPrefix}-${randomChunk}`,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation - match backend Salon schema requirements (GSTIN is optional)
    if (!formData.salonName || !formData.salonAddress || !formData.ownerName ||
      !formData.email || !formData.MobileNumber) {
      triggerToast("Please fill in all required fields (Salon Name, Address, Owner Name, Email, Mobile Number)");
      return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      triggerToast("Please enter a valid email address");
      return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(formData.MobileNumber)) {
      triggerToast("Mobile number must be exactly 10 digits");
      return;
    }

    if (!isEditMode) {
      if (!formData.password) {
        triggerToast("Password is required for new users");
        return;
      }
      if (!formData.licenseToken) {
        triggerToast("License Token is required for new users");
        return;
      }
    }

    try {
      // Build salon data matching backend Salon schema exactly
      const salonData = {
        salonName: formData.salonName,
        salonAddress: formData.salonAddress,
        licenseToken: formData.licenseToken,
        ownerName: formData.ownerName,
        gstin: formData.gstin || undefined, // GSTIN is optional
        email: formData.email,
        MobileNumber: formData.MobileNumber,
        businessCategory: formData.businessCategory || undefined,
        password: formData.password || undefined, // Only include if provided
        // Optional fields
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      };

      if (isEditMode) {
        // Use appropriate update function based on role
        if (role === 'reseller') {
          await updateResellerSalon({ id, ...salonData }).unwrap();
        } else {
          await updateSalon({ id, ...salonData }).unwrap();
        }
        triggerToast(`Salon (${formData.salonName}) Successfully Updated`);
      } else {
        await createSalon(salonData).unwrap();
        triggerToast(`Salon Successfully Created`);
        // Reset form
        setFormData({
          salonName: "",
          salonAddress: "",
          licenseToken: "",
          licenseKey: "",
          ownerName: "",
          gstin: "",
          email: "",
          MobileNumber: "",
          password: "",
          businessCategory: "",
          gender: "",
          dateOfBirth: "",
        });
      }

      // Navigate back after a delay
      setTimeout(() => {
        navigate("/user-management");
      }, 1500);
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to save user";
      triggerToast(errorMessage);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-8 space-y-6">
          <UserManagementHeader
            title="Manage User"
            description="Manage and organize all POS business types within Quick X POS."
            showAction={false}
          />
          {isLoadingSalon ? (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <UserFormCard
              formData={formData}
              onChange={handleChange}
              onGenerateLicenseToken={handleGenerateLicenseToken}
              onSubmit={handleSubmit}
              isLoading={isCreating || isUpdating}
              categories={categoriesData?.categories || []}
              isEditMode={isEditMode}
            />
          )}
        </div>
      </main>
      <SuccessToast
        show={toast.show}
        message={toast.message}
        onClose={handleToastClose}
      />
    </div>
  );
};

export default ManageUser;

