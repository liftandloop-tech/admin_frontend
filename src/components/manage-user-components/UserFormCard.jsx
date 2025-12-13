import React from "react";
import CredentialSection from "./CredentialSection";
import BusinessProfileSection from "./BusinessProfileSection";
import LicenseTokenSection from "./LicenseTokenSection";
import FormActions from "./FormActions";

const UserFormCard = ({
  formData,
  onChange,
  onGenerateLicenseToken,
  onSubmit,
  isLoading = false,
  categories = [],
  isEditMode = false,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
    >
      <CredentialSection
        data={{ ...formData, isEditMode }}
        onChange={onChange}
      />
      <BusinessProfileSection data={formData} onChange={onChange} categories={categories} />
      <LicenseTokenSection
        data={formData}
        onChange={onChange}
        onGenerate={onGenerateLicenseToken}
        isEditMode={isEditMode}
      />
      <FormActions isLoading={isLoading} />
    </form>
  );
};

export default UserFormCard;

