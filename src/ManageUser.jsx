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

const ManageUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const role = useSelector(selectRole);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    salonAddress: "",
    gstin: "",
    userName: "",
    email: "",
    contact: "",
    businessName: "",
    businessCategory: "",
    planType: "",
    duration: "",
    startDate: "",
    licenseKey: "",
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
      setFormData({
        userId: salon.id?.slice(-6) || salon._id?.slice(-6) || "",
        password: "", // Don't populate password
        salonAddress: salon.salonAddress || "",
        gstin: salon.gstin || "",
        userName: salon.ownerName || "",
        email: salon.email || "",
        contact: salon.mobileNumber || salon.MobileNumber || "",
        businessName: salon.salonName || "",
        businessCategory: salon.businessCategory || "",
        planType: salon.subscriptionPlan?.name || "",
        duration: salon.subscriptionPlan?.duration || "",
        startDate: salon.subscriptionStartDate ? new Date(salon.subscriptionStartDate).toISOString().split('T')[0] : "",
        licenseKey: salon.license?.licenseKey || salon.licenseKey || "",
      });
    }
  }, [isEditMode, salonData]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleGenerateUserId = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const newUserId = `UI${randomNumber}`;
    setFormData((prev) => ({
      ...prev,
      userId: newUserId,
    }));
  };

  const triggerToast = (message) => {
    setToast({ show: true, message });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleGenerateKey = () => {
    const randomChunk = Math.random().toString(16).slice(2, 10).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      licenseKey: `QXP-${prev.businessCategory.substring(0, 3).toUpperCase()}-${randomChunk}`,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!formData.userName || !formData.email || !formData.businessName || !formData.businessCategory) {
      triggerToast("Please fill in all required fields");
      return;
    }

    if (!isEditMode) {
      if (!formData.password) {
        triggerToast("Password is required for new users");
        return;
      }
      if (!formData.salonAddress) {
        triggerToast("Salon address is required");
        return;
      }
      if (!formData.contact) {
        triggerToast("Contact number is required");
        return;
      }
    }

    try {
      const salonData = {
        ownerName: formData.userName,
        email: formData.email,
        MobileNumber: formData.contact,
        salonAddress: formData.salonAddress,
        gstin: formData.gstin,
        salonName: formData.businessName,
        businessCategory: formData.businessCategory,
        password: formData.password || undefined, // Only include if provided
      };

      if (isEditMode) {
        // Use appropriate update function based on role
        if (role === 'reseller') {
          await updateResellerSalon({ id, ...salonData }).unwrap();
        } else {
          await updateSalon({ id, ...salonData }).unwrap();
        }
        triggerToast(`User (${formData.userId}) Successfully Updated`);
      } else {
        await createSalon(salonData).unwrap();
        triggerToast(`User Successfully Created`);
        // Reset form
        setFormData({
          userId: "",
          password: "",
          salonAddress: "",
          gstin: "",
          userName: "",
          email: "",
          contact: "",
          businessName: "",
          businessCategory: "",
          planType: "",
          duration: "",
          startDate: "",
          licenseKey: "",
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
              onGenerateUserId={handleGenerateUserId}
              onGenerateKey={handleGenerateKey}
              onSubmit={handleSubmit}
              isLoading={isCreating || isUpdating}
              categories={categoriesData?.categories || []}
              plans={plansData?.plans || []}
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

